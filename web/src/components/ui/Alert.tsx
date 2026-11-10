import type { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  action?: ReactNode;
}

/** Mensagem de erro anunciada por leitores de tela (role="alert"). */
export default function Alert({ children, action }: AlertProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger"
    >
      <p>{children}</p>
      {action}
    </div>
  );
}
