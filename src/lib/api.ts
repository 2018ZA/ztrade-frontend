import type { ChartResponse, Period, Signal } from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export interface FetchChartParams {
  symbol: string;
  period: Period;
  signals?: Signal[];
  signal?: AbortSignal;
}

export async function fetchChart({
  symbol,
  period,
  signals,
  signal,
}: FetchChartParams): Promise<ChartResponse> {
  const params = new URLSearchParams({ symbol, period });
  if (signals && signals.length > 0) {
    params.set(
      'signals',
      signals.filter(Boolean).map((s) => s as string).join(','),
    );
  }

  const res = await fetch(`${BASE_URL}/api/chart?${params.toString()}`, {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      if (err?.detail) message = err.detail;
    } catch {
      // тело не JSON — оставляем статус
    }
    throw new Error(message);
  }

  return (await res.json()) as ChartResponse;
}

export async function healthCheck(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { signal });
    return res.ok;
  } catch {
    return false;
  }
}
