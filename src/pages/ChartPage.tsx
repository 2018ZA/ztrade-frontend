import { useMemo, useState } from 'react';
import { Toolbar } from '../components/Toolbar';
import { StatsBar } from '../components/StatsBar';
import { SignalLegend } from '../components/SignalLegend';
import { CandlestickChart } from '../components/CandlestickChart';
import { useChartData } from '../hooks/useChartData';
import { DEFAULT_SYMBOL } from '../lib/symbols';
import type { Period, Signal } from '../types';

export function ChartPage() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [period, setPeriod] = useState<Period>('1d');
  const [signals, setSignals] = useState<Signal[]>([]);

  const { data, loading, error, reload } = useChartData({
    symbol,
    period,
    signals: signals.length ? signals : undefined,
  });

  const { lastPrice, lastChange } = useMemo(() => {
    if (!data || data.points.length === 0) return {};
    const first = data.points[0];
    const last = data.points[data.points.length - 1];
    return {
      lastPrice: last.close,
      lastChange: first.close ? (last.close - first.close) / first.close : 0,
    };
  }, [data]);

  return (
    <div className="page">
      <Toolbar
        symbol={symbol}
        period={period}
        signals={signals}
        onSymbolChange={setSymbol}
        onPeriodChange={setPeriod}
        onSignalsChange={setSignals}
        onReload={reload}
      />

      {error && (
        <div className="alert alert--error">
          Не удалось загрузить данные: <strong>{error}</strong>
          <button className="alert__retry" onClick={reload}>Повторить</button>
        </div>
      )}

      {data && (
        <StatsBar
          symbol={data.symbol}
          interval={data.interval}
          points={data.points_count}
          signalPoints={data.signal_points_count}
          lastPrice={lastPrice}
          lastChange={lastChange}
        />
      )}

      <SignalLegend />

      <div className={'card' + (loading ? ' card--loading' : '')}>
        {data && <CandlestickChart points={data.points} />}
        {!data && !error && <div className="chart-wrap chart-wrap--loading">Загрузка…</div>}
        {loading && data && <div className="card__loader" />}
      </div>
    </div>
  );
}
