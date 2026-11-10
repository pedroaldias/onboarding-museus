import { Transform } from 'class-transformer';

/** Remove espaços nas pontas. Roda antes da validação (ValidationPipe com transform). */
export const Trim = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );
