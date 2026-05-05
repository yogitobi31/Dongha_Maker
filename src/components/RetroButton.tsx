import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type RetroButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function RetroButton({ children, className, ...props }: RetroButtonProps) {
  return (
    <button {...props} className={`retro-button ${className ?? ''}`.trim()}>
      <span className="retro-button__ornament">◆</span>
      <span>{children}</span>
    </button>
  );
}
