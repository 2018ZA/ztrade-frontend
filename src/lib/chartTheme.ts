// Единая палитра для графика. Согласована с CSS-переменными в index.css.
export const CHART_COLORS = {
  bg: '#0b0f14',
  text: '#9ca3af',
  grid: 'rgba(36, 48, 64, 0.5)',
  border: '#243040',

  // Свечи (стандартный bullish/bearish)
  bull: '#22c55e',
  bear: '#ef4444',

  // Сигналы — цвет = сила, от ярко-зелёного к ярко-красному
  strongBuy: '#22c55e',   // ярко-зелёный
  buy:       '#86efac',   // светло-зелёный
  neutral:   '#94a3b8',   // серый
  sell:      '#fca5a5',   // бледно-красный
  strongSell:'#ef4444',   // ярко-красный

  volume: 'rgba(59, 130, 246, 0.35)',
} as const;
