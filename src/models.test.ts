import { describe, it, expect } from 'vitest';
import { 
  DurationPredictor, 
  ImpactClassifier, 
  HotspotDetector, 
  SemanticEventRetriever, 
  ResourceRecommender, 
  runPipeline,
  TrafficEventInput 
} from './models';

describe('Traffic Intelligence Models', () => {
  const sampleEvent: TrafficEventInput = {
    event_cause: 'cricket match',
    zone: 'Central',
    corridor: 'MG Road',
    junction: 'Anil Kumble Circle',
    latitude: 12.9716,
    longitude: 77.5946,
    description: 'IPL Match',
    requires_road_closure_num: 1,
    hour_of_day: 18,
    day_of_week: 5,
    month: 5,
    is_weekend: 1,
    crowd_event_flag: 1,
    hist_avg_resolution_time: 45,
    hist_event_count: 10,
    hist_road_closure_rate: 0.8,
    crowd_size: 30000
  };

  it('DurationPredictor works correctly', () => {
    const predictor = new DurationPredictor();
    const duration = predictor.predict(sampleEvent);
    expect(duration).toBeGreaterThan(0);
    // baseTime = 45 + 20 + 15 + 15 = 95
    // duration = 95 * 0.9 + 5 = 90.5
    expect(duration).toBe(90.5);
  });

  it('ImpactClassifier works correctly', () => {
    const classifier = new ImpactClassifier();
    const impact = classifier.predict(sampleEvent);
    // score = 3 (closure) + 2 (crowd) + 2 (hour 18) = 7
    expect(impact).toBe('High');
  });

  it('HotspotDetector identifies hotspots', () => {
    const detector = new HotspotDetector();
    const result = detector.checkIfHotspot(12.9716, 77.5946);
    expect(result.isHotspot).toBe(true);
    expect(result.hotspot?.center_lat).toBe(12.9716);
  });

  it('SemanticEventRetriever finds similar events', () => {
    const retriever = new SemanticEventRetriever();
    const similar = retriever.searchSimilar(sampleEvent, 2);
    expect(similar.length).toBe(2);
    expect(similar[0].event_cause.toLowerCase()).toContain('match');
  });

  it('ResourceRecommender provides allocations', () => {
    const recommender = new ResourceRecommender();
    const resources = recommender.recommend('High', 'cricket match', true, true);
    expect(resources.officers).toBeGreaterThanOrEqual(28); // 20 + 5 (closure) + 3 (hotspot) = 28
    expect(resources.barricades).toBe(60); // 40 + 20 = 60
  });

  it('runPipeline coordinates all models', () => {
    const result = runPipeline(sampleEvent);
    expect(result.predDuration).toBeGreaterThan(0);
    expect(result.predImpact).toBe('High');
    expect(result.isHotspot).toBe(true);
    expect(result.simEvents.length).toBe(2);
    expect(result.resources.officers).toBeGreaterThanOrEqual(28);
  });
});
