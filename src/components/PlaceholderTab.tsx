interface Props {
  title: string;
  description: string;
}

export function PlaceholderTab({ title, description }: Props) {
  return (
    <div className="placeholder">
      <div className="placeholder__icon">🧩</div>
      <h2 className="placeholder__title">{title}</h2>
      <p className="placeholder__text">{description}</p>
      <p className="placeholder__hint">Раздел в разработке</p>
    </div>
  );
}
