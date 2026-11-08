interface HeaderProps {
  apiOk: boolean | null;
}

export function Header({ apiOk }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo">Z</span>
        <span className="header__title">Z-trade</span>
      </div>
      <div
        className="header__status"
        title={apiOk === null ? 'Проверка API…' : apiOk ? 'API доступен' : 'API недоступен'}
      >
        <span
          className={
            'status-dot ' +
            (apiOk === null
              ? 'status-dot--pending'
              : apiOk
                ? 'status-dot--ok'
                : 'status-dot--err')
          }
        />
        <span className="status-label">
          {apiOk === null ? 'checking' : apiOk ? 'online' : 'offline'}
        </span>
      </div>
    </header>
  );
}
