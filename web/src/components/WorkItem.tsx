import type { Work } from '@/models/types';
import Button from './ui/Button';

interface Props {
  work: Work;
  onDelete: (work: Work) => void;
}

export default function WorkItem({ work, onDelete }: Props) {
  return (
    <li className="animate-rise rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-snug tracking-tight">
            {work.title}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-accent">
            Autor: {work.author}
          </p>
        </div>
        <Button
          variant="danger"
          className="shrink-0"
          aria-label={`Apagar ${work.title}`}
          onClick={() => onDelete(work)}
        >
          Apagar
        </Button>
      </div>
      <p className="mt-3 text-muted">{work.description}</p>
    </li>
  );
}
