// Контракт crypto_allert_api (см. README API)

export type Signal =
  | 'buy'
  | 'sell'
  | 'strong buy'
  | 'strong sell'
  | 'neutral'
  | null;

export type Period =
  | '1h' | '4h' | '6h' | '12h' | '1d'
  | '2d' | '7d' | '30d' | 'all';

export interface ChartPoint {
  timestamp: number;          // Unix ms
  time: string;               // ISO 8601 UTC
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  signal: Signal;
  score: number | null;
  has_signal: boolean;
  is_filtered_signal: boolean;
}

export interface ChartResponse {
  symbol: string;
  interval: string;
  period: Period;
  from_time: string;
  to_time: string;
  points_count: number;
  signal_points_count: number;
  points: ChartPoint[];
}

export interface ApiError {
  detail: string;
}
