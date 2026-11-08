import { SYMBOLS } from '../lib/symbols';
import type { Period, Signal } from '../types';

const PERIODS: { id: Period; label: string }[] = [
  { id: '1h',  label: '1 ч' },
  { id: '4h',  label: '4 ч' },
  { id: '6h',  label: '6 ч' },
  { id: '12h', label: '12 ч' },
  { id: '1d',  label: '1 д' },
];

const SIGNALS: { id: Exclude<Signal, null>; label: string }[] = [
  { id: 'buy',         label: 'Buy' },
  { id: 'strong buy',  label: 'Strong Buy' },
  { id: 'sell',        label: 'Sell' },
  { id: 'strong sell', label: 'Strong Sell' },
  { id: 'neutral',     label: 'Neutral' },
];

interface ToolbarProps {
  symbol: string;
  period: Period;
  signals: Signal[];
  onSymbolChange: (s: string) => void;
  onPeriodChange: (p: Period) => void;
  onSignalsChange: (s: Signal[]) => void;
  onReload: () => void;
}

export function Toolbar({
  symbol, period, signals, onSymbolChange, onPeriodChange, onSignalsChange, onReload,
}: ToolbarProps) {
  const toggleSignal = (id: Exclude<Signal, null>) => {
    const set = new Set(signals);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    onSignalsChange(Array.from(set) as Signal[]);
  };

  return (
    <section className="toolbar">
      <label className="field">
        <span className="field__label">Инструмент</span>
        <select
          className="field__select"
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value)}
        >
          <optgroup label="Криптовалюты">
            {SYMBOLS.filter((s) => s.group === 'crypto').map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </optgroup>
          <optgroup label="Металлы">
            {SYMBOLS.filter((s) => s.group === 'metal').map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </optgroup>
        </select>
      </label>

      <div className="field">
        <span className="field__label">Период</span>
        <div className="chip-group">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              className={'chip' + (period === p.id ? ' chip--active' : '')}
              onClick={() => onPeriodChange(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field field--wide">
        <span className="field__label">
          Фильтр сигналов {signals.length === 0 && <em>(все)</em>}
        </span>
        <div className="chip-group">
          {SIGNALS.map((s) => (
            <button
              key={s.id}
              className={
                'chip chip--' + s.id.replace(' ', '-') +
                (signals.includes(s.id) ? ' chip--active' : '')
              }
              onClick={() => toggleSignal(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn--ghost" onClick={onReload} title="Обновить данные">
        ↻ Обновить
      </button>
    </section>
  );
}
