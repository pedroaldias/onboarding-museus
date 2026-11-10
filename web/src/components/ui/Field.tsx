import { useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

// 16px evita o zoom automático do iOS; min-h-11 = alvo de toque de 44px.
const control =
  'w-full min-h-11 rounded-xl border border-control bg-surface px-4 py-2.5 text-base text-ink transition-colors placeholder:text-muted hover:border-ink focus-visible:border-accent';

interface FieldProps {
  label: string;
  hint?: string;
}

function Shell({
  id,
  label,
  hint,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  hint,
  id,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Shell id={fieldId} label={label} hint={hint}>
      <input
        id={fieldId}
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        className={control}
        {...props}
      />
    </Shell>
  );
}

export function TextAreaField({
  label,
  hint,
  id,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Shell id={fieldId} label={label} hint={hint}>
      <textarea
        id={fieldId}
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        className={`${control} resize-y`}
        {...props}
      />
    </Shell>
  );
}
