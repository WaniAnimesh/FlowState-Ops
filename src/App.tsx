import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

import { BENGALURU_EVENTS } from './data';
import { runPipeline, TrafficEventInput } from './models';
import './index.css';

Chart.register(annotationPlugin);

// Helper to convert BENGALURU_EVENTS into our TrafficEventInput for models
function mapEventToModelInput(ev: any): TrafficEventInput {
  // We'll create some fake metrics based on the existing event data to feed the model
  const crowdSizeInt = parseInt(ev.crowd.replace(/,/g, ''), 10) || 10000;
  
  return {
    event_cause: ev.title.toLowerCase().includes('match') ? 'cricket match' : ev.title.toLowerCase().includes('procession') ? 'procession' : 'political rally',
    zone: 'Central',
    corridor: ev.venue,
    junction: ev.venue,
    latitude: ev.lat,
    longitude: ev.lng,
    description: ev.title,
    requires_road_closure_num: ev.id === 3 ? 1 : 0, // Mock: some events need closure
    hour_of_day: parseInt(ev.time.split(':')[0]) || 18,
    day_of_week: 5,
    month: 5,
    is_weekend: 1,
    crowd_event_flag: crowdSizeInt > 5000 ? 1 : 0,
    hist_avg_resolution_time: parseInt(ev.delay) || 30,
    hist_event_count: 5,
    hist_road_closure_rate: 0.5,
    crowd_size: crowdSizeInt
  };
}

export default function App() {
  const [activeId, setActiveId] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('en-US'));
  
  // Track which actions are active
  const [authState, setAuthState] = useState<Record<string, boolean>>({});

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const activeEvent = BENGALURU_EVENTS.find(e => e.id === activeId) || BENGALURU_EVENTS[1];

  // Run our pseudo-models
  const modelInput = mapEventToModelInput(activeEvent);
  const pipelineResult = runPipeline(modelInput);

  // Time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Map Setup
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([12.9716, 77.5946], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
      mapRef.current = map;
      markerGroupRef.current = L.layerGroup().addTo(map);

      // Add all events
      BENGALURU_EVENTS.forEach((ev) => {
        if (ev.id === 0) return;
        const marker = L.circleMarker([ev.lat, ev.lng], { 
          radius: 8, color: '#ffffff', weight: 2, fillColor: 'var(--primary)', fillOpacity: 1 
        }).addTo(markerGroupRef.current!);
        marker.bindTooltip(`<b>${ev.title}</b>`, { direction: 'top', offset: [0, -10] });
        marker.on('click', () => setActiveId(ev.id));
      });
    }

    // Fly to active
    if (mapRef.current) {
      mapRef.current.flyTo([activeEvent.lat, activeEvent.lng], activeEvent.zoom, { animate: true, duration: 1 });
    }
  }, [activeId, activeEvent]);

  // Chart setup
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (!chartInstanceRef.current) {
      const ctx = chartCanvasRef.current.getContext('2d');
      if (!ctx) return;

      const timeLabels = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00(NOW)', '22:00', '23:00', '00:00', '01:00'];
      const gradBlue = ctx.createLinearGradient(0,0,0,200); 
      gradBlue.addColorStop(0, 'rgba(14, 165, 233, 0.2)'); 
      gradBlue.addColorStop(1, 'transparent');
      
      const gradRed = ctx.createLinearGradient(0,0,0,200); 
      gradRed.addColorStop(0, 'rgba(239, 68, 68, 0.2)'); 
      gradRed.addColorStop(1, 'transparent');

      const config: ChartConfiguration = {
        type: 'line',
        data: {
          labels: timeLabels,
          datasets: [
            { label: 'Logged Traffic (Past/Present)', data: [], borderColor: '#0ea5e9', backgroundColor: gradBlue, borderWidth: 3, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#0ea5e9' },
            { label: 'AI Projected Delay (No Action)', data: [], borderColor: '#ef4444', backgroundColor: gradRed, borderWidth: 3, borderDash: [5, 5], fill: true, tension: 0.4, pointRadius: 0 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: {family: 'Inter'} } },
            annotation: { annotations: { line1: { type: 'line', xMin: '21:00(NOW)', xMax: '21:00(NOW)', borderColor: '#64748b', borderWidth: 2, borderDash: [3, 3], label: { display: true, content: 'PRESENT', position: 'start', backgroundColor: '#1e293b', font: {family: 'JetBrains Mono', size: 10} } } as any } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b', font: {size: 10} } },
            y: { grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' }, max: 70, title: {display: true, text: 'Delay Impact (Mins)'} }
          }
        }
      };
      
      chartInstanceRef.current = new Chart(ctx, config);
    }
  }, []);

  // Update chart when actions or event change
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    let pastData = activeEvent.baseChart.map((v, i) => i <= 5 ? v : null);
    let futureData = activeEvent.baseChart.map((v, i) => i >= 5 ? v : null);

    let totMitig = 0;
    activeEvent.actions.forEach((act, idx) => { 
      if(authState[`${activeEvent.id}_${idx}`]) totMitig += act.mitigation; 
    });

    if (totMitig > 0) {
      futureData = futureData.map((val, idx) => { 
        return val !== null ? (idx === 5 ? val : Math.max(5, val - totMitig)) : null; 
      });
    }

    const chart = chartInstanceRef.current;
    chart.data.datasets[0].data = pastData;
    chart.data.datasets[1].data = futureData;

    let maxF = Math.max(...(futureData.map(v => v || 0)));
    let nColor = maxF < 30 ? '#10b981' : (maxF < 45 ? '#f59e0b' : '#ef4444');

    chart.data.datasets[1].borderColor = nColor;
    const ctx = chart.ctx;
    const grad = ctx.createLinearGradient(0,0,0,200);
    grad.addColorStop(0, `${nColor}33`); 
    grad.addColorStop(1, 'transparent');
    chart.data.datasets[1].backgroundColor = grad;
    
    chart.update();
  }, [activeEvent, authState]);

  // Calculations for simulation block
  let basePeak = Math.max(...activeEvent.baseChart);
  let totMitig = 0;
  activeEvent.actions.forEach((act, idx) => { 
    if(authState[`${activeEvent.id}_${idx}`]) totMitig += act.mitigation; 
  });
  let newPeak = Math.max(5, basePeak - totMitig);
  let reduct = basePeak > 0 ? Math.round(((basePeak - newPeak) / basePeak) * 100) : 0;
  if(totMitig === 0) { newPeak = basePeak; reduct = 0; }

  const simEventsMatch = pipelineResult.simEvents.length > 0 ? pipelineResult.simEvents[0] : null;
  const historicMatchRate = simEventsMatch ? (simEventsMatch.similarity_score * 100).toFixed(0) + '%' : activeEvent.simAcc;

  return (
    <>
      {/* TOP HEADER */}
      <header className="header">
        <div className="header-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          FlowState Ops <span style={{fontWeight:400, color:'#cbd5e1'}}>- AI Event Congestion Decision Support System</span>
        </div>
        <div className="header-clock">{currentTime}</div>
      </header>

      <div className="dashboard-grid">
        {/* Top KPI Strip */}
        <div className="top-kpi-strip">
          <div className="top-kpi-item"><span className="top-kpi-lbl">Event Impact Score</span><span className="top-kpi-val">{activeEvent.score}</span></div>
          <div className="top-kpi-item"><span className="top-kpi-lbl">Peak Delay</span><span className="top-kpi-val">{activeEvent.delay}</span></div>
          <div className="top-kpi-item"><span className="top-kpi-lbl">Affected Roads</span><span className="top-kpi-val">{activeEvent.roads}</span></div>
          <div className="top-kpi-item"><span className="top-kpi-lbl">Officers Needed</span><span className="top-kpi-val">{pipelineResult.resources.officers} / {activeEvent.cops}</span></div>
          <div className="top-kpi-item"><span className="top-kpi-lbl">Confidence</span><span className="top-kpi-val" style={{color:'var(--success)'}}>{activeEvent.conf}</span></div>
        </div>

        {/* LEFT PANEL: EVENT PROFILE */}
        <aside className="panel">
          <div className="panel-head">Event Profile Ingestion</div>
          <div className="panel-body">
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px'}}>Data fused from ticketing APIs, venue manifests, and historical anomaly tracking.</p>
            
            <div className="profile-card">
              <div className="profile-title">{activeEvent.title}</div>
              <div className="profile-venue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {activeEvent.venue}
              </div>

              <div className="data-group">
                <div className="data-lbl">Event Impact Score</div>
                <div className="data-val"><span>{activeEvent.score}</span> <span style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500}}>/ 100</span></div>
                <div className="data-sub">
                  <strong className="ac-highlight">Based On</strong><br/>
                  • Expected Crowd: {activeEvent.crowd}<br/>
                  • Historical Similarity: {historicMatchRate}<br/>
                  • ML Forecast Class: {pipelineResult.predImpact}<br/>
                  • CBD Route Dependency<br/><br/>
                  <strong className="ac-highlight">Forecast Confidence: <span style={{color: 'var(--success)'}}>{activeEvent.conf}</span></strong>
                </div>
              </div>

              <div className="data-group">
                <div className="data-lbl">Critical Congestion Window</div>
                <div className="data-val" style={{fontSize: '1.25rem'}}>{activeEvent.peak}</div>
                <div className="data-sub">
                  Peak Delay Forecast: <span style={{fontWeight:700, color:'var(--dark-accent)'}}>{Math.round(pipelineResult.predDuration)} mins</span><br/>
                  Affected Junctions: <span style={{fontWeight:700, color:'var(--dark-accent)'}}>{activeEvent.junctions}</span>
                </div>
              </div>

              <div className="history-box">
                <h4>WHY THIS EVENT IS HIGH RISK</h4>
                <p>
                  <strong className="ac-highlight">Similar Events</strong><br/>
                  {pipelineResult.simEvents.map((se, i) => (
                    <span key={i}>{se.description} (Similarity: {(se.similarity_score*100).toFixed(0)}%)<br/></span>
                  ))}
                  <br/>
                  <strong className="ac-highlight">Observed Outcomes</strong><br/>
                  • {activeEvent.junctions} Junctions affected<br/>
                  • Delay peaked at {activeEvent.peakDelay}<br/>
                  {pipelineResult.isHotspot && <>• In recognized historic hotspot!<br/></>}
                  <br/>
                  <strong className="ac-highlight">AI Confidence:</strong> {activeEvent.conf}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: MAP + FORECAST DECK */}
        <main className="center-col">
          <div className="map-widget">
            <div ref={mapContainerRef} id="leafletMap"></div>
          </div>

          <div className="panel forecast-widget">
            <div className="deck-container">
              {BENGALURU_EVENTS.map(ev => {
                if (ev.id === 0) return null;
                return (
                  <div 
                    key={ev.id}
                    className={`event-card ${ev.id === activeId ? 'active' : ''}`}
                    onClick={() => setActiveId(ev.id)}
                  >
                    <div className="ec-time">{ev.time}</div>
                    <div className="ec-title">{ev.title}</div>
                  </div>
                );
              })}
            </div>

            <div className="panel-head" style={{border:'none', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span style={{color:'var(--text-main)'}}>The Future: Impact Forecast</span>
              <span style={{color:'var(--primary)', fontFamily:'var(--font-mono)'}}>+3 HOUR PROJECTION</span>
            </div>
            
            <div className="chart-wrapper">
              <canvas ref={chartCanvasRef} id="predictionChart"></canvas>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: DECISION SUPPORT ENGINE */}
        <aside className="panel">
          <div className="panel-head">Decision Support Engine</div>
          <div className="panel-body">
            
            <div className="engine-intro">
              <h4>AI Recommendation Engine</h4>
              <p className="desc-text">
                Historical events, current traffic, road capacity and event schedules indicate a <strong>{activeEvent.simAcc} probability</strong> of severe congestion during dispersal.<br/><br/>
                The actions below are ranked by expected congestion reduction.
              </p>
            </div>

            <div className="resource-plan-card">
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                <strong className="ac-highlight" style={{fontSize:'0.85rem'}}>RESOURCE PLAN</strong>
                <span className="status-badge">READY</span>
              </div>
              <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap:'12px'}}>
                <div>
                  <span className="ac-highlight">Required</span><br/>
                  {pipelineResult.resources.officers} Officers<br/>
                  {pipelineResult.resources.barricades} Barricades<br/>
                  Diversion: {pipelineResult.resources.diversion_plan}
                </div>
                <div>
                  <span className="ac-highlight">Available</span><br/>
                  {Math.floor(activeEvent.cops*1.2)} Officers<br/>
                  40 Barricades<br/>
                  6 Tow Trucks
                </div>
              </div>
            </div>

            <div className="action-list">
              {activeEvent.actions.map((act, idx) => {
                const aKey = `${activeEvent.id}_${idx}`;
                const isAuth = authState[aKey];

                return (
                  <div key={idx} className={`action-card ${isAuth ? 'authorized' : ''}`}>
                    <div className="ac-head">
                      <span className="ac-title">{act.title}</span>
                    </div>
                    <div className="ac-rich-desc">
                      <div style={{marginBottom:'8px'}}><strong className="ac-highlight">Reason:</strong> {act.reason}</div>
                      <div className="ac-grid">
                        <div><strong className="ac-highlight">Expected Impact</strong><br/>Delay: {act.targetDelay}<br/>Queue: {act.targetQueue}</div>
                        <div><strong className="ac-highlight">Resources</strong><br/>{act.res}</div>
                      </div>
                      <div>
                        <strong className="ac-highlight">Why Recommended?</strong><br/>
                        Historical Success: {act.histSucc}<br/>
                        Used in: {act.usedIn}
                      </div>
                      <div style={{marginTop:'8px'}}><strong className="ac-highlight">Confidence: <span style={{color:'var(--success)'}}>{activeEvent.conf}</span></strong></div>
                    </div>
                    <div className="btn-row">
                      <button className="btn btn-sim" onClick={() => setAuthState(prev => ({...prev, [aKey]: !prev[aKey]}))}>
                        {isAuth ? 'Revert Simulation' : 'What-If Simulate'}
                      </button>
                      <button className="btn btn-auth" onClick={() => setAuthState(prev => ({...prev, [aKey]: true}))}>
                        Authorize
                      </button>
                      <div className="auth-badge">✓ Active & Deployed</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sim-block">
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'33%'}}>
                <span style={{color:'var(--text-muted)'}}>Without Action</span>
                <strong style={{color:'var(--danger)', fontSize:'1.1rem'}}>{basePeak} mins</strong>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'33%'}}>
                <span style={{color:'var(--text-muted)'}}>With Action</span>
                <strong style={{color:'var(--success)', fontSize:'1.1rem'}}>{newPeak} mins</strong>
              </div>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'33%', borderLeft:'1px solid var(--border-solid)'}}>
                <span style={{color:'var(--text-muted)'}}>Reduction</span>
                <strong style={{color:'var(--primary)', fontSize:'1.1rem'}}>{reduct}%</strong>
              </div>
            </div>

          </div>
        </aside>

        {/* BOTTOM KPI STRIP */}
        <div className="bottom-kpi-strip">
          <div className="kpi-block">
            <div className="kpi-lbl">Affected Intersections</div>
            <div className="kpi-val">{activeEvent.kpiVals.v1 || activeEvent.junctions}</div>
            <div className="kpi-sub" dangerouslySetInnerHTML={{ __html: `Expected To Reach <strong style="color:var(--danger)">LOS E/F</strong>` }} />
          </div>
          <div className="kpi-block">
            <div className="kpi-lbl">Diversion Readiness</div>
            <div className="kpi-val">{activeEvent.kpiVals.v2 || '68%'}</div>
            <div className="kpi-sub" dangerouslySetInnerHTML={{ __html: `<span style="color:var(--success)">Route Active</span>` }} />
          </div>
          <div className="kpi-block">
            <div className="kpi-lbl">Field Staff Needed</div>
            <div className="kpi-val">{pipelineResult.resources.officers}</div>
            <div className="kpi-sub" dangerouslySetInnerHTML={{ __html: `<strong style="color:white">Predicted Need</strong>` }} />
          </div>
          <div className="kpi-block">
            <div className="kpi-lbl">Post-Event Learning</div>
            <div className="kpi-val">{pipelineResult.simEvents.length > 0 ? (pipelineResult.simEvents[0].similarity_score * 100).toFixed(0) : '91'}%</div>
            <div className="kpi-sub" dangerouslySetInnerHTML={{ __html: `<strong style="color:white">Coverage</strong><br/>Predicted Impact: ${pipelineResult.predImpact}` }} />
          </div>
        </div>

      </div>
    </>
  );
}
