import type { CSSProperties } from 'react';
import Link from 'next/link';
import type { Attraction } from '@/models/types';
import Button from './ui/Button';

interface Props {
  attraction: Attraction;
  index: number;
  onDelete: (attraction: Attraction) => void;
}

export default function AttractionCard({ attraction, index, onDelete }: Props) {
  // Entrada escalonada só nos primeiros itens (transform/opacity: barato para a GPU).
  const style = { animationDelay: `${Math.min(index, 8) * 45}ms` } as CSSProperties;

  return (
    <li
      style={style}
      className="group relative flex animate-rise flex-col rounded-2xl border border-line bg-surface p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-card has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-accent"
    >
      <h2 className="font-display text-2xl leading-snug tracking-tight">
        {/* Link "esticado": o card inteiro é clicável sem aninhar controles */}
        <Link
          href={`/attractions/${attraction.id}`}
          className="after:absolute after:inset-0 after:content-[''] hover:text-accent focus-visible:outline-none"
        >
          {attraction.name}
        </Link>
      </h2>

      <p className="mt-2 line-clamp-3 text-muted">{attraction.description}</p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span
          className="pointer-events-none text-sm font-medium text-accent transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          Ver obras →
        </span>
        <Button
          variant="danger"
          className="relative z-10 min-h-11"
          aria-label={`Apagar ${attraction.name}`}
          onClick={() => onDelete(attraction)}
        >
          Apagar
        </Button>
      </div>
    </li>
  );
}
