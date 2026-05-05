import type { PropsWithChildren } from 'react';

type OrnatePanelProps = PropsWithChildren<{
  title?: string;
  className?: string;
}>;

export function OrnatePanel({ title, className, children }: OrnatePanelProps) {
  return (
    <section className={`ornate-panel ${className ?? ''}`.trim()}>
      {title ? <header className="ornate-panel__title">{title}</header> : null}
      <div className="ornate-panel__content">{children}</div>
    </section>
  );
}
