import { useEffect, useRef } from 'react';
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
} from 'lightweight-charts';
import { CHART_COLORS } from '../lib/chartTheme';
import type { ChartPoint, Signal } from '../types';

interface Props {
  points: ChartPoint[];
  height?: number;
}

function signalColor(s: Signal): string {
  switch (s) {
    case 'buy':
      return CHART_COLORS.bull;
    case 'strong buy':
      return CHART_COLORS.strongBuy;
    case 'sell':
      return CHART_COLORS.bear;
    case 'strong sell':
      return CHART_COLORS.strongSell;
    case 'neutral':
      return CHART_COLORS.neutral;
    default:
      return CHART_COLORS.neutral;
  }
}

function signalPosition(s: Signal): 'aboveBar' | 'belowBar' | 'inBar' {
  if (s === 'buy' || s === 'strong buy') return 'belowBar';
  if (s === 'sell' || s === 'strong sell') return 'aboveBar';
  return 'inBar';
}

function signalShape(s: Signal): 'circle' | 'arrowUp' | 'arrowDown' {
  if (s === 'strong buy') return 'arrowUp';
  if (s === 'strong sell') return 'arrowDown';
  return 'circle';
}

export function CandlestickChart({ points, height = 520 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  // В v5 маркеры управляются отдельным плагином
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

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

    // v5: маркеры — отдельный плагин
    const markersPlugin = createSeriesMarkers(candle, []);

    chartRef.current = chart;
    candleRef.current = candle;
    volumeRef.current = volume;
    markersRef.current = markersPlugin;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      volumeRef.current = null;
      markersRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleRef.current || !volumeRef.current || !chartRef.current) return;

    if (points.length === 0) {
      candleRef.current.setData([]);
      volumeRef.current.setData([]);
      markersRef.current?.setMarkers([]);
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

    const markers: SeriesMarker<Time>[] = points
      .filter((p) => p.is_filtered_signal && p.signal)
      .map((p) => ({
        time: Math.floor(p.timestamp / 1000) as UTCTimestamp,
        position: signalPosition(p.signal),
        color: signalColor(p.signal),
        shape: signalShape(p.signal),
        text: p.signal?.toUpperCase(),
        size: p.signal?.startsWith('strong') ? 2 : 1,
      }));

    markersRef.current?.setMarkers(markers);
    chartRef.current.timeScale().fitContent();
  }, [points]);

  return (
    <div className="chart-wrap" style={{ height }}>
      <div ref={containerRef} className="chart-canvas" />
      {points.length === 0 && (
        <div className="chart-empty">Нет данных за выбранный период</div>
      )}
    </div>
  );
}
