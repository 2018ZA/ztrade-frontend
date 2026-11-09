import type { ChartPoint } from '../types';
import { SIGNAL_META } from '../lib/signals';

interface ChartTooltipProps {
  point: ChartPoint;
}

function fmtPrice(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function fmtVolume(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function fmtDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChartTooltip({ point }: ChartTooltipProps) {
  const meta = point.signal ? SIGNAL_META[point.signal] : null;
  const change = point.close - point.open;
  const changePct = point.open ? (change / point.open) * 100 : 0;
  const isUp = change >= 0;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__date">{fmtDate(point.timestamp)}</div>

      <div className="chart-tooltip__rows">
        <div className="chart-tooltip__row">
          <span className="chart-tooltip__key">O</span>
          <span className="chart-tooltip__val">{fmtPrice(point.open)}</span>
        </div>
        <div className="chart-tooltip__row">
          <span className="chart-tooltip__key">H</span>
          <span className="chart-tooltip__val">{fmtPrice(point.high)}</span>
        </div>
        <div className="chart-tooltip__row">
          <span className="chart-tooltip__key">L</span>
          <span className="chart-tooltip__val">{fmtPrice(point.low)}</span>
        </div>
        <div className="chart-tooltip__row">
          <span className="chart-tooltip__key">C</span>
          <span className="chart-tooltip__val">{fmtPrice(point.close)}</span>
        </div>
        <div className="chart-tooltip__row">
          <span className="chart-tooltip__key">V</span>
          <span className="chart-tooltip__val">{fmtVolume(point.volume)}</span>
        </div>
        <div
          className={
            'chart-tooltip__row chart-tooltip__row--change ' +
            (isUp ? 'is-up' : 'is-down')
          }
        >
          <span className="chart-tooltip__key">Δ</span>
          <span className="chart-tooltip__val">
            {isUp ? '+' : ''}
            {change.toFixed(4)} ({changePct.toFixed(2)}%)
          </span>
        </div>
      </div>

      {point.signal && meta && (
        <div className="chart-tooltip__signal">
          <span
            className="chart-tooltip__signal-dot"
            style={{
              backgroundColor: meta.color,
              boxShadow: `0 0 8px ${meta.color}aa`,
            }}
          />
          <span
            className="chart-tooltip__signal-label"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>
          {point.score !== null && (
            <span className="chart-tooltip__signal-score">
              {point.score > 0 ? '+' : ''}
              {point.score.toFixed(0)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
