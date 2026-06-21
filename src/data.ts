import { TrafficEvent, SlideData } from "./types";

export const BENGALURU_EVENTS: TrafficEvent[] = [
  {
    id: 0,
    title: "Bengaluru City Overview",
    venue: "Aggregated City-Wide Grid",
    lat: 12.9716,
    lng: 77.5946,
    time: "Ongoing Peak Blocks",
    score: 92,
    crowd: "345,000+",
    delay: "51 mins",
    roads: 17,
    cops: 126,
    conf: "89%",
    peak: "19:15 - 21:45",
    peakDelay: "51 mins",
    junctions: 47,
    simEvs: "All Overlapping Nodes Combined",
    simAcc: "91%",
    zoom: 12,
    baseChart: [15, 20, 25, 30, 40, 55, 60, 50, 30, 20],
    actions: [
      {
        title: "Broadcast City-Wide Advisory",
        mitigation: 10,
        targetDelay: "41 mins",
        targetQueue: "15km total -> 10km",
        res: "6 Variable Message Signs (VMS), FM Radio Blast",
        reason: "Generic advisory for aggregate overlap risk",
        histSucc: "20% demand reduction",
        usedIn: "Standard Heavy Congestion Protocols"
      }
    ],
    kpiVals: {
      v1: "112",
      v2: "45%",
      v3: "345 Needed",
      v4: "82% Covered"
    }
  },
  {
    id: 1,
    title: "IPL Cricket Match Dispersal",
    venue: "Chinnaswamy Stadium",
    lat: 12.9788,
    lng: 77.5996,
    time: "18:00 - 22:30",
    score: 91,
    crowd: "40,000+",
    delay: "51 mins",
    roads: 17,
    cops: 126,
    conf: "91%",
    peak: "19:15 - 21:45",
    peakDelay: "51 mins",
    junctions: 47,
    simEvs: "IPL Final 2023, RCB vs Elas 2024",
    simAcc: "91%",
    zoom: 14,
    baseChart: [5, 8, 12, 18, 25, 45, 52, 38, 15, 5],
    actions: [
      {
        title: "Establish BMTC Bus-Only Corridor",
        mitigation: 24,
        targetDelay: "51 → 27 mins",
        targetQueue: "3.2km → 1.1km",
        res: "24 Duty Officers, 8 Heavy Barricades",
        reason: "Model 5 heuristic based on historical RCB matches",
        histSucc: "41% overall congestion reduction at central hub",
        usedIn: "IPL Cup Finals 2023, Standard Match Dispersals"
      },
      {
        title: "MG Road API Navigation Rerouting",
        mitigation: 15,
        targetDelay: "27 → 12 mins",
        targetQueue: "1.1km → 0.4km",
        res: "12 Deployment Cops, 2 Intelligent VMS",
        reason: "Triggered standard deviation routing models",
        histSucc: "30% real-time GPS navigation deviations achieved",
        usedIn: "TCS Tech Fest 2024, High-Density VIP Convoys"
      }
    ],
    kpiVals: {
      v1: "47",
      v2: "68% Alert",
      v3: "126 Cops",
      v4: "91% Acc"
    }
  },
  {
    id: 2,
    title: "Global Tech Summit VIPs",
    venue: "Palace Grounds",
    lat: 13.0035,
    lng: 77.5855,
    time: "09:00 - 18:00",
    score: 85,
    crowd: "15,000",
    delay: "42 mins",
    roads: 12,
    cops: 85,
    conf: "94%",
    peak: "17:00 - 18:30",
    peakDelay: "42 mins",
    junctions: 32,
    simEvs: "Aero India VIP Transit, Invest Karnataka",
    simAcc: "94%",
    zoom: 14,
    baseChart: [10, 15, 22, 28, 40, 48, 35, 20, 10, 5],
    actions: [
      {
        title: "Divert Airport Cabs (Hebbal Flyover)",
        mitigation: 20,
        targetDelay: "42 → 22 mins",
        targetQueue: "2.1km → 0.8km",
        res: "15 Patrol Officers, 3 Interactive VMS",
        reason: "94% similarity to VIP arrival peak flows",
        histSucc: "35% reduction in northbound arterial density",
        usedIn: "Aero India 2023, Karnataka Startup Conclave"
      }
    ],
    kpiVals: {
      v1: "32",
      v2: "85% Ready",
      v3: "85 Cops",
      v4: "94% Acc"
    }
  },
  {
    id: 3,
    title: "Political Mega-Rally",
    venue: "National College Grounds / Freedom Park",
    lat: 12.9490,
    lng: 77.5735,
    time: "10:00 - 14:00",
    score: 95,
    crowd: "85,000",
    delay: "65 mins",
    roads: 25,
    cops: 180,
    conf: "95%",
    peak: "13:30 - 15:30",
    peakDelay: "65 mins",
    junctions: 65,
    simEvs: "Assembly Elections Rally 2024",
    simAcc: "95%",
    zoom: 14,
    baseChart: [5, 10, 15, 20, 22, 18, 10, 5, 2, 2],
    actions: [
      {
        title: "Activate Remote Bus Depots",
        mitigation: 30,
        targetDelay: "65 → 35 mins",
        targetQueue: "5.0km → 2.0km",
        res: "40 Support Officers, 4 Tow Trucks",
        reason: "Model 4 Similarity detected 95% election match",
        histSucc: "45% reduction in roadside heavy bus parking gridlock",
        usedIn: "Central Election Campaigns, State Budget Assemblage"
      }
    ],
    kpiVals: {
      v1: "65",
      v2: "42% Flow",
      v3: "180 Cops",
      v4: "88% Acc"
    }
  },
  {
    id: 4,
    title: "Temple Chariot & Religious Procession",
    venue: "Basavanagudi Bull Temple Rd",
    lat: 12.9422,
    lng: 77.5679,
    time: "16:00 - 20:00",
    score: 78,
    crowd: "10,000",
    delay: "35 mins",
    roads: 8,
    cops: 45,
    conf: "82%",
    peak: "18:00 - 19:30",
    peakDelay: "35 mins",
    junctions: 24,
    simEvs: "Kadlekai Parishe Chariot Days, Shivajinagar Feast",
    simAcc: "82%",
    zoom: 15,
    baseChart: [15, 25, 38, 55, 42, 20, 10, 5, 2, 2],
    actions: [
      {
        title: "Enforce Bull Temple Pedestrian Isolation",
        mitigation: 18,
        targetDelay: "35 → 17 mins",
        targetQueue: "1.5km → Complete Bypass",
        res: "20 Ground Officers, 30 Lightweight Barricades",
        reason: "Prevent vehicular-crowd conflict risk",
        histSucc: "Zero pedestrian vehicle collisions, high flow bypass",
        usedIn: "Kadlekai Parishe Annual Fair 2023, 2024"
      }
    ],
    kpiVals: {
      v1: "24",
      v2: "50% Isolated",
      v3: "45 Cops",
      v4: "78% Acc"
    }
  },
  {
    id: 5,
    title: "International Concert Peak Dispersal",
    venue: "BIEC Arena (Tumkur Road)",
    lat: 13.0519,
    lng: 77.4727,
    time: "19:00 - 23:30",
    score: 88,
    crowd: "25,000",
    delay: "45 mins",
    roads: 10,
    cops: 60,
    conf: "87%",
    peak: "23:00 - 01:00",
    peakDelay: "45 mins",
    junctions: 18,
    simEvs: "DJ Snake World Tour BIEC, Coldplay Proposed",
    simAcc: "87%",
    zoom: 14,
    baseChart: [5, 8, 12, 15, 20, 30, 45, 60, 40, 15],
    actions: [
      {
        title: "Suspend Highway Toll Plaza Charges",
        mitigation: 35,
        targetDelay: "45 → 10 mins",
        targetQueue: "4.0km → 0.5km",
        res: "5 Toll Liaison Officers, Highway Authority Sync",
        reason: "Toll lanes create heavy dispersal queuing bottle",
        histSucc: "75% vehicle throughput upgrade per lane-hour",
        usedIn: "DJ Snake BIEC Tour, Sunburn Bengaluru Event Nights"
      }
    ],
    kpiVals: {
      v1: "18",
      v2: "90% Flow",
      v3: "60 Cops",
      v4: "92% Acc"
    }
  }
];

export const PRESENTATION_SLIDES: SlideData[] = [
  {
    title: "FlowState Ops",
    subtitle: "AI-Powered Event Congestion Decision Support System",
    oneLiner: "Shifting traffic operations from reactive damage control to proactive, database-linked crowd mitigation.",
    bullets: [
      "🏏 Overlapping planned events crash Bengaluru's central business district roads.",
      "🚨 Planned festivals, high-security blockades, and political gatherings occur simultaneously.",
      "🧠 Prevents systemic gridlock by anticipating peak dispersal queues rather than acting on active jams."
    ],
    visualType: "screenshot"
  },
  {
    title: "Why Current Traffic Control Fails",
    subtitle: "The Broken Status Quo of City Management",
    oneLiner: "Today, traffic police fight a losing battle against event peak windows because of manual, memory-driven deployment.",
    bullets: [
      "⏱️ Reactive latency: Map turns solid dark red before officers are deployed.",
      "🤷 Experience-driven guesswork: Deploying officers based on memory of historical years.",
      "📝 Fragmented Playbooks: Manual spreadsheet coordination between transit and stadium hubs.",
      "🪵 No Post-Event Feedback Loop: Once the jam dissipates, telemetry vanishes."
    ],
    visualType: "failures"
  },
  {
    title: "Intelligence & Data Pipeline",
    subtitle: "Fusing Event Demographics with Physical Corridors",
    oneLiner: "How we process metadata into reliable micro-level crowd predictions.",
    bullets: [
      "🗂️ Ingestion: Stadium ticket databases, rally registrations, municipal timetables.",
      "🦾 LightGBM Engine: Evaluates 10+ time, day, route, weather and location metrics.",
      "🗺️ Clusters & Hotspots: Detects localized bottleneck patterns via DBSCAN spatial trees.",
      "🧬 Similarity Index: FAISS queries the historic city database to match the RCB vs Chennai 2023 final profile."
    ],
    visualType: "pipeline"
  },
  {
    title: "AI + ML + RAG Engine Model Stack",
    subtitle: "Intelligence Grid Built for Field Deployment",
    oneLiner: "A predictive core linking data models directly with patrol directives.",
    bullets: [
      "Model 1: Duration Predictor (LightGBM) forecasts congestion clearing curves.",
      "Model 2: Impact Classifier grades incident levels (Low, Medium, High).",
      "Model 3: DBSCAN spatial filters pinpoint recurring crowd blockade centers.",
      "Model 4: FAISS retrievers fetch pre-approved mitigation playbooks.",
      "Model 5: GenAI briefings write plain-English advisories for dispatch centers."
    ],
    visualType: "rag"
  },
  {
    title: "Command Center Layout",
    subtitle: "Engineered for Quick Dual-Quadrant Decisions",
    oneLiner: "Left is Event Intake, Center is Map, Right is Intervention, and Bottom is Accountability.",
    bullets: [
      "👁️ Event Profiles: Real-time telemetry cards and crowd forecasts.",
      "📍 Living Geospatial Grid: Leaflet canvas charting incidents and reroutes.",
      "🎛️ Action Sandbox: Operators simulate interventions before deployment.",
      "📊 Live SLA metrics: Delay forecasts update as soon as controllers click authorize."
    ],
    visualType: "deck"
  },
  {
    title: "Watch the Simulator in Action",
    subtitle: "Dual Simulation Outcome Comparison",
    oneLiner: "A look at what FlowState Ops provides with the simple click of a button.",
    bullets: [
      "🏟️ Scenario: Match Dispersal is scheduled at Chinnaswamy at 21:00 peak.",
      "❌ NO DIVERSIONS ACTIVE: Peak baseline delay reaches 51 minutes across 47 junctions.",
      "✅ FLOWSTATE RECOMMENDED BARRICADES: Peak queue falls to 18 mins (64% drop).",
      "📲 Click 'Launch Live Command Center' on top to test live scenario overrides!"
    ],
    visualType: "scenario"
  },
  {
    title: "The Roadmap to Predictive Cities",
    subtitle: "Deploy, Learn, and Close the Traffic Loop",
    oneLiner: "From standalone dispatch boards to autonomic signals running entire metros.",
    bullets: [
      "🏁 Phase 1 (MVP) - Current Status: Predictive event dispatching and sandbox simulators.",
      "🗺️ Phase 2 - API Syncs: Broad scale deep link map routing redirects (Google Maps, Waze).",
      "🚦 Phase 3 - Closed Loop: Direct autonomic adaptive signal timings synced directly with FlowState models."
    ],
    visualType: "vision"
  }
];
