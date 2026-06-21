export type ImpactClass = 'Low' | 'Medium' | 'High';

export interface TrafficEventInput {
  event_cause: string;
  zone: string;
  corridor: string;
  junction: string;
  latitude: number;
  longitude: number;
  description: string;
  requires_road_closure_num: number;
  hour_of_day: number;
  day_of_week: number;
  month: number;
  is_weekend: number;
  crowd_event_flag: number;
  hist_avg_resolution_time: number;
  hist_event_count: number;
  hist_road_closure_rate: number;
  crowd_size?: number; // Added to match the UI requirements
}

export class DurationPredictor {
  predict(event: TrafficEventInput): number {
    // Simulated prediction based on inputs
    let baseTime = event.hist_avg_resolution_time || 30;
    if (event.requires_road_closure_num) baseTime += 20;
    if (event.crowd_event_flag) baseTime += 15;
    if (event.hour_of_day >= 17 && event.hour_of_day <= 20) baseTime += 15;
    
    // Simulate LightGBM scaling
    return baseTime * 0.9 + 5;
  }
}

export class ImpactClassifier {
  predict(event: TrafficEventInput): ImpactClass {
    let score = 0;
    if (event.requires_road_closure_num) score += 3;
    if (event.crowd_event_flag) score += 2;
    if (event.hour_of_day >= 17 && event.hour_of_day <= 20) score += 2;
    if (event.hist_avg_resolution_time > 60) score += 2;
    
    if (score >= 6) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  }
}

export interface Hotspot {
  center_lat: number;
  center_lon: number;
  avg_duration: number;
  event_count: number;
}

export class HotspotDetector {
  hotspots: Hotspot[] = [
    { center_lat: 12.9716, center_lon: 77.5946, avg_duration: 60, event_count: 50 }, // MG Road
    { center_lat: 12.9788, center_lon: 77.5996, avg_duration: 55, event_count: 30 }, // Chinnaswamy
    { center_lat: 13.0035, center_lon: 77.5855, avg_duration: 45, event_count: 20 }  // Palace Grounds
  ];

  checkIfHotspot(lat: number, lon: number): { isHotspot: boolean; hotspot: Hotspot | null } {
    for (const h of this.hotspots) {
      const dist = Math.sqrt(Math.pow(h.center_lat - lat, 2) + Math.pow(h.center_lon - lon, 2));
      if (dist < 0.015) {
        return { isHotspot: true, hotspot: h };
      }
    }
    return { isHotspot: false, hotspot: null };
  }
}

export interface SimilarityResult {
  event_cause: string;
  junction: string;
  description: string;
  impact_class: ImpactClass;
  similarity_score: number;
}

export class SemanticEventRetriever {
  referenceEvents: SimilarityResult[] = [
    { event_cause: 'cricket match', junction: 'Chinnaswamy Stadium', description: 'IPL Final Match', impact_class: 'High', similarity_score: 0.91 },
    { event_cause: 'procession', junction: 'Trinity Circle', description: 'VIP Religious Procession', impact_class: 'High', similarity_score: 0.88 },
    { event_cause: 'political rally', junction: 'Freedom Park', description: 'Large Political Gathering', impact_class: 'High', similarity_score: 0.95 },
    { event_cause: 'tech summit', junction: 'Palace Grounds', description: 'Global Investors Meet', impact_class: 'Medium', similarity_score: 0.94 },
    { event_cause: 'concert', junction: 'BIEC', description: 'International Music Festival', impact_class: 'Medium', similarity_score: 0.87 }
  ];

  searchSimilar(event: TrafficEventInput, topK: number = 3): SimilarityResult[] {
    const query = `${event.event_cause} ${event.junction} ${event.description}`.toLowerCase();
    
    const scored = this.referenceEvents.map(ref => {
      let score = 0.5 + (Math.random() * 0.2); // Base similarity
      const refStr = `${ref.event_cause} ${ref.junction} ${ref.description}`.toLowerCase();
      // Rough mock of semantic similarity using keyword matching
      const keywords = ['procession', 'rally', 'cricket', 'concert', 'summit', 'vip'];
      let matchCount = 0;
      for (const kw of keywords) {
        if (query.includes(kw) && refStr.includes(kw)) matchCount += 2;
      }
      
      // Override for specific venues
      if (query.includes('chinnaswamy') && refStr.includes('chinnaswamy')) matchCount += 3;
      if (query.includes('procession') && refStr.includes('procession')) matchCount += 3;
      
      score = Math.min(0.99, score + (matchCount * 0.1));
      
      return { ...ref, similarity_score: score };
    });
    
    scored.sort((a, b) => b.similarity_score - a.similarity_score);
    return scored.slice(0, topK);
  }
}

export interface ResourceAllocation {
  officers: number;
  barricades: number;
  diversion_plan: string;
}

export class ResourceRecommender {
  baseAllocations: Record<ImpactClass, ResourceAllocation> = {
    'Low': { officers: 2, barricades: 5, diversion_plan: 'Monitor Local Traffic' },
    'Medium': { officers: 8, barricades: 15, diversion_plan: 'Immediate Alternate Route Assignment' },
    'High': { officers: 20, barricades: 40, diversion_plan: 'City-wide Zone Diversion Plan Alpha' }
  };

  recommend(impact_class: ImpactClass, event_cause: string, road_closure: boolean, in_hotspot: boolean): ResourceAllocation {
    const allocation = { ...this.baseAllocations[impact_class] };
    
    if (road_closure) {
      allocation.officers += 5;
      allocation.barricades += 20;
    }
    
    if (in_hotspot) {
      allocation.officers += 3;
      allocation.diversion_plan = 'Critical: Pre-approved Hotspot Diversion Strategy Deployed';
    }
    
    const causeLower = event_cause.toLowerCase();
    if (['procession', 'protest', 'vip_movement', 'political_rally'].includes(causeLower)) {
      allocation.officers += 15;
      allocation.barricades += 10;
    }
    
    return allocation;
  }
}

export function runPipeline(event: TrafficEventInput) {
  const model1 = new DurationPredictor();
  const model2 = new ImpactClassifier();
  const model3 = new HotspotDetector();
  const model4 = new SemanticEventRetriever();
  const model5 = new ResourceRecommender();
  
  const predDuration = model1.predict(event);
  const predImpact = model2.predict(event);
  const { isHotspot } = model3.checkIfHotspot(event.latitude, event.longitude);
  const simEvents = model4.searchSimilar(event, 2);
  const resources = model5.recommend(predImpact, event.event_cause, event.requires_road_closure_num > 0, isHotspot);
  
  return {
    predDuration,
    predImpact,
    isHotspot,
    simEvents,
    resources
  };
}
