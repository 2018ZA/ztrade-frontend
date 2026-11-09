import { SIGNAL_META, SIGNAL_ORDER } from '../lib/signals';

export function SignalLegend() {
  return (
    <div className="signal-legend" role="region" aria-label="Легенда сигналов">
      <span className="signal-legend__title">Сигналы</span>
      {SIGNAL_ORDER.map((id) => {
        const meta = SIGNAL_META[id];
        return (
          <span
            key={id}
            className="signal-legend__item"
            title={meta.description}
          >
            <span
              className="signal-legend__dot"
              style={{
                backgroundColor: meta.color,
                boxShadow: `0 0 6px ${meta.color}80`,
              }}
            />
            <span className="signal-legend__label">{meta.label}</span>
          </span>
        );
      })}
    </div>
  );
}
