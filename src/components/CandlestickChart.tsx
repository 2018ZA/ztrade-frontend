import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  type UTCTimestamp,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type CandlestickData,
  type HistogramData,
  type SeriesMarker,
  type Time,
  type MouseEventParams,
} from 'lightweight-charts';
import { CHART_COLORS } from '../lib/chartTheme';
import { SIGNAL_META } from '../lib/signals';
import { ChartTooltip } from './ChartTooltip';
import type { ChartPoint, Signal } from '../types';

interface Props {
  points: ChartPoint[];
  height?: number;
}

interface TooltipState {
  x: number;
  y: number;
  point: ChartPoint;
}

function signalColor(s: Signal): string {
  if (!s) return CHART_COLORS.neutral;
  return SIGNAL_META[s].color;
}

function signalPosition(s: Signal): 'aboveBar' | 'belowBar' | 'inBar' {
  if (s === 'buy' || s === 'strong buy') return 'belowBar';
  if (s === 'sell' || s === 'strong sell') return 'aboveBar';
  return 'inBar';
}

export function CandlestickChart({ points, height = 520 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const pointMapRef = useRef<Map<number, ChartPoint>>(new Map());
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // ---------- Инициализация графика (один раз) ----------
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: CHART_COLORS.bg },
        textColor: CHART_COLORS.text,
        fontSize: 12,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      },
      grid: {
        vertLines: { color: CHART_COLORS.grid, style: LineStyle.Dotted },
        horzLines: { color: CHART_COLORS.grid, style: LineStyle.Dotted },
      },
      rightPriceScale: {
        borderColor: CHART_COLORS.border,
        scaleMargins: { top: 0.1, bottom: 0.28 },
      },
      timeScale: {
        borderColor: CHART_COLORS.border,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: CHART_COLORS.border,
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#1f2937',
        },
        horzLine: {
          color: CHART_COLORS.border,
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#1f2937',
        },
      },
      localization: {
        locale: 'ru-RU',
        priceFormatter: (p: number) =>
          p.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          }),
      },
    });

    const candle = chart.addSeries(CandlestickSeries, {
      upColor: CHART_COLORS.bull,
      downColor: CHART_COLORS.bear,
      borderUpColor: CHART_COLORS.bull,
      borderDownColor: CHART_COLORS.bear,
      wickUpColor: CHART_COLORS.bull,
      wickDownColor: CHART_COLORS.bear,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    const volume = chart.addSeries(HistogramSeries, {
      color: CHART_COLORS.volume,
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      lastValueVisible: false,
      priceLineVisible: false,
    });
    volume.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    const markersPlugin = createSeriesMarkers(candle, []);

    chartRef.current = chart;
    candleRef.current = candle;
    volumeRef.current = volume;
    markersRef.current = markersPlugin;

    // ---------- Tooltip на hover ----------
    chart.subscribeCrosshairMove((param: MouseEventParams<Time>) => {
      if (
        !param.point ||
        !param.time ||
        param.point.x < 0 ||
        param.point.y < 0
      ) {
        setTooltip(null);
        return;
      }
      if (typeof param.time !== 'number') {
        setTooltip(null);
        return;
      }
      const point = pointMapRef.current.get(param.time);
      if (!point) {
        setTooltip(null);
        return;
      }
      setTooltip({ x: param.point.x, y: param.point.y, point });
    });

    return () => {
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      volumeRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // ---------- Данные ----------
  useEffect(() => {
    if (!candleRef.current || !volumeRef.current || !chartRef.current) return;

    if (points.length === 0) {
      candleRef.current.setData([]);
      volumeRef.current.setData([]);
      markersRef.current?.setMarkers([]);
      pointMapRef.current = new Map();
      return;
    }

    const candleData: CandlestickData[] = points.map((p) => ({
      time: Math.floor(p.timestamp / 1000) as UTCTimestamp,
      open: p.open,
      high: p.high,
      low: p.low,
      close: p.close,
    }));

    const volumeData: HistogramData[] = points.map((p) => ({
      time: Math.floor(p.timestamp / 1000) as UTCTimestamp,
      value: p.volume,
      color:
        p.close >= p.open
          ? 'rgba(34,197,94,0.35)'
          : 'rgba(239,68,68,0.35)',
    }));

    candleRef.current.setData(candleData);
    volumeRef.current.setData(volumeData);

    // Принудительно включаем авто-масштабирование при смене данных
    candleRef.current.priceScale().applyOptions({ autoScale: true });


    // lookup-таблица для tooltip
    const map = new Map<number, ChartPoint>();
    points.forEach((p) => map.set(Math.floor(p.timestamp / 1000), p));
    pointMapRef.current = map;

    // ---------- Маркеры: только круги, без текста ----------
    const markers: SeriesMarker<Time>[] = points
      .filter((p) => p.is_filtered_signal && p.signal)
      .map((p) => {
        const isStrong =
          p.signal === 'strong buy' || p.signal === 'strong sell';
        return {
          time: Math.floor(p.timestamp / 1000) as UTCTimestamp,
          position: signalPosition(p.signal),
          color: signalColor(p.signal),
          shape: 'circle' as const,
          text: '',                          // ← без подписи
          size: isStrong ? 2 : 1,            // ← strong крупнее
        };
      });

    markersRef.current?.setMarkers(markers);
    chartRef.current.timeScale().fitContent();
  }, [points]);

  // ---------- Позиционирование tooltip с флипом ----------
  let tooltipLeft = 0;
  let tooltipTop = 0;
  if (tooltip && containerRef.current) {
    const chartWidth = containerRef.current.clientWidth;
    const tooltipWidth = Math.min(230, chartWidth - 32);
    const tooltipHeight = 240;
    const offset = 16;

    const wouldOverflowRight =
      tooltip.x + offset + tooltipWidth > chartWidth;
    tooltipLeft = wouldOverflowRight
      ? Math.max(8, tooltip.x - offset - tooltipWidth)
      : tooltip.x + offset;

    tooltipTop = Math.max(
      8,
      Math.min(tooltip.y - 40, height - tooltipHeight - 8),
    );
  }

  return (
    <div className="chart-wrap" style={{ height }}>
      <div ref={containerRef} className="chart-canvas" />
      {points.length === 0 && (
        <div className="chart-empty">Нет данных за выбранный период</div>
      )}
      {tooltip && (
        <div
          className="chart-tooltip-wrapper"
          style={{ left: tooltipLeft, top: tooltipTop }}
        >
          <ChartTooltip point={tooltip.point} />
        </div>
      )}
    </div>
  );
}
