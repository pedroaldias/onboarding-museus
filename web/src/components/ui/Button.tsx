import type { ComponentProps } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'destructive';

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition duration-150 active:translate-y-px disabled:opacity-60 disabled:active:translate-y-0';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  secondary:
    'border border-control bg-surface text-ink hover:bg-accent-soft',
  ghost: 'text-muted hover:bg-accent-soft hover:text-ink',
  danger: 'border border-control text-danger hover:bg-danger-soft',
  destructive: 'bg-danger text-paper hover:opacity-90',
};

/** Classes do botão, reutilizáveis em <Link> (ex.: "Nova atração"). */
export function buttonClass(variant: ButtonVariant = 'secondary', extra = '') {
  return `${base} ${variants[variant]} ${extra}`.trim();
}

// ComponentProps inclui `ref` (React 19: ref é uma prop comum em componentes de função)
interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export default function Button({
  variant = 'secondary',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, className)}
      {...rest}
    >
      {loading && (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
