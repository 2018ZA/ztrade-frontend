import type { Signal } from '../types';

interface SignalBadgeProps {
  signal: Signal;
  score: number | null;
}

const LABEL: Record<Exclude<Signal, null>, string> = {
  buy: 'BUY',
  sell: 'SELL',
  'strong buy': 'STRONG BUY',
  'strong sell': 'STRONG SELL',
  neutral: 'NEUTRAL',
};

const CLASS: Record<Exclude<Signal, null>, string> = {
  buy: 'badge--buy',
  sell: 'badge--sell',
  'strong buy': 'badge--strong-buy',
  'strong sell': 'badge--strong-sell',
  neutral: 'badge--neutral',
};

export function SignalBadge({ signal, score }: SignalBadgeProps) {
  if (!signal) {
    return <span className="badge badge--none">—</span>;
  }
  return (
    <span className={'badge ' + CLASS[signal]}>
      {LABEL[signal]}
      {score !== null && (
        <em className="badge__score">{score > 0 ? '+' : ''}{score}</em>
      )}
    </span>
  );
}
