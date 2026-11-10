import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchChart } from '../lib/api';
import type { ChartResponse, Period, Signal } from '../types';

interface UseChartDataArgs {
  symbol: string;
  period: Period;
  signals: Signal[] | undefined;
}

interface State {
  data: ChartResponse | null;
  loading: boolean;
  error: string | null;
}

export function useChartData({ symbol, period, signals }: UseChartDataArgs) {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const signalsKey = (signals ?? []).filter(Boolean).sort().join(',');

  const load = useCallback(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setState({ data: null, loading: true, error: null });

    fetchChart({ symbol, period, signals, signal: ctrl.signal })
      .then((data) => {
        if (!ctrl.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setState((s) => ({ ...s, loading: false, error: err.message }));
      });
  }, [symbol, period, signalsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { ...state, reload: load };
}
