import { Prisma } from '@prisma/client';

/** P2025: update/delete em um registro que não existe. */
export function isRecordNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
}
