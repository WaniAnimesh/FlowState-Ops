export interface Action {
  title: string;
  mitigation: number;
  targetDelay: string;
  targetQueue: string;
  res: string;
  reason: string;
  histSucc: string;
  usedIn: string;
}

export interface KPIValues {
  v1: string;
  v2: string;
  v3: string;
  v4: string;
}

export interface TrafficEvent {
  id: number;
  title: string;
  venue: string;
  lat: number;
  lng: number;
  time: string;
  score: number;
  crowd: string;
  delay: string;
  roads: number;
  cops: number;
  conf: string;
  peak: string;
  peakDelay: string;
  junctions: number;
  simEvs: string;
  simAcc: string;
  zoom: number;
  baseChart: number[];
  actions: Action[];
  kpiVals: KPIValues;
}

export interface SlideData {
  title: string;
  subtitle: string;
  oneLiner?: string;
  bullets?: string[];
  visualType: 'screenshot' | 'failures' | 'pipeline' | 'rag' | 'deck' | 'scenario' | 'vision';
}
