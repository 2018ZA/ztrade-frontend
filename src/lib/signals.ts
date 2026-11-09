import type { Signal } from '../types';
import { CHART_COLORS } from './chartTheme';

export interface SignalMeta {
  id: Exclude<Signal, null>;
  label: string;       // "Strong Buy"
  shortLabel: string;  // "SB" — на случай мелких меток
  color: string;       // HEX — цвет круга
  description: string; // human-readable для tooltip / title
}

export const SIGNAL_META: Record<Exclude<Signal, null>, SignalMeta> = {
  'strong buy': {
    id: 'strong buy',
    label: 'Strong Buy',
    shortLabel: 'SB',
    color: CHART_COLORS.strongBuy,
    description: 'Ярко-зелёный · сильный сигнал к покупке',
  },
  buy: {
    id: 'buy',
    label: 'Buy',
    shortLabel: 'B',
    color: CHART_COLORS.buy,
    description: 'Светло-зелёный · умеренный сигнал к покупке',
  },
  neutral: {
    id: 'neutral',
    label: 'Neutral',
    shortLabel: 'N',
    color: CHART_COLORS.neutral,
    description: 'Серый · нейтральный сигнал',
  },
  sell: {
    id: 'sell',
    label: 'Sell',
    shortLabel: 'S',
    color: CHART_COLORS.sell,
    description: 'Бледно-красный · умеренный сигнал к продаже',
  },
  'strong sell': {
    id: 'strong sell',
    label: 'Strong Sell',
    shortLabel: 'SS',
    color: CHART_COLORS.strongSell,
    description: 'Ярко-красный · сильный сигнал к продаже',
  },
};

// Порядок в легенде: от «бычьего» к «медвежьему»
export const SIGNAL_ORDER: Exclude<Signal, null>[] = [
  'strong buy',
  'buy',
  'neutral',
  'sell',
  'strong sell',
];
