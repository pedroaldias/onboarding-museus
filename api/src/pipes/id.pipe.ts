import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const MAX_INT32 = 2_147_483_647;

/**
 * Aceita só inteiros positivos que cabem em Int. Sem isso, um id gigante
 * (ex.: /attraction/99999999999) chega ao Prisma e vira erro 500 em vez de 4xx.
 */
@Injectable()
export class IdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const id = /^\d+$/.test(value) ? Number(value) : NaN;
    if (!Number.isSafeInteger(id) || id < 1 || id > MAX_INT32) {
      throw new BadRequestException('Identificador inválido');
    }
    return id;
  }
}
