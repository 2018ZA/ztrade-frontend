interface StatsBarProps {
  symbol: string;
  interval: string;
  points: number;
  signalPoints: number;
  lastPrice?: number;
  lastChange?: number;
}

const fmt = (n?: number) =>
  n === undefined ? '—' : n.toLocaleString('en-US', { maximumFractionDigits: 4 });

export function StatsBar({
  symbol, interval, points, signalPoints, lastPrice, lastChange,
}: StatsBarProps) {
  const changeClass =
    lastChange === undefined
      ? ''
      : lastChange > 0
        ? 'stat__value stat__value--up'
        : lastChange < 0
          ? 'stat__value stat__value--down'
          : 'stat__value';

  return (
    <section className="stats">
      <div className="stat">
        <span className="stat__label">Инструмент</span>
        <span className="stat__value">{symbol}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Интервал</span>
        <span className="stat__value">{interval}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Свечей</span>
        <span className="stat__value">{points}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Сигналов</span>
        <span className="stat__value">{signalPoints}</span>
      </div>
      {lastPrice !== undefined && (
        <div className="stat">
          <span className="stat__label">Последняя цена</span>
          <span className={changeClass}>
            {fmt(lastPrice)}
            {lastChange !== undefined && (
              <em> ({(lastChange * 100).toFixed(2)}%)</em>
            )}
          </span>
        </div>
      )}
    </section>
  );
}
