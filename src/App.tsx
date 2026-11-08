import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Tabs, type TabId } from './components/Tabs';
import { ChartPage } from './pages/ChartPage';
import { HeatmapPage } from './pages/HeatmapPage';
import { StatsPage } from './pages/StatsPage';
import { healthCheck } from './lib/api';

export default function App() {
  const [tab, setTab] = useState<TabId>('chart');
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = () => {
      healthCheck().then((ok) => {
        if (!cancelled) setApiOk(ok);
      });
    };
    check();
    const id = window.setInterval(check, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="app">
      <Header apiOk={apiOk} />
      <Tabs active={tab} onChange={setTab} />
      <main className="main">
        {tab === 'chart'   && <ChartPage />}
        {tab === 'heatmap' && <HeatmapPage />}
        {tab === 'stats'   && <StatsPage />}
      </main>
      <footer className="footer">
        <span>Z-trade · данные: crypto_allert_api</span>
      </footer>
    </div>
  );
}
