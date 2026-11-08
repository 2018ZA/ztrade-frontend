export type TabId = 'chart' | 'heatmap' | 'stats';

interface TabsProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'chart',   label: 'График' },
  { id: 'heatmap', label: 'Тепловая карта' },
  { id: 'stats',   label: 'Статистика' },
];

export function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav className="tabs" role="tablist">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={'tab' + (active === t.id ? ' tab--active' : '')}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
