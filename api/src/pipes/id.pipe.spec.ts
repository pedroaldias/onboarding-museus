import { BadRequestException } from '@nestjs/common';
import { IdPipe } from './id.pipe';

describe('IdPipe', () => {
  const pipe = new IdPipe();

  it('converte inteiros positivos', () => {
    expect(pipe.transform('1')).toBe(1);
    expect(pipe.transform('2147483647')).toBe(2147483647);
  });

  it.each([
    'abc',
    '',
    '0',
    '-1',
    '1.5',
    '1e3',
    ' 1',
    '2147483648',
    '99999999999999999999',
  ])('rejeita "%s" com 400', (value) => {
    expect(() => pipe.transform(value)).toThrow(BadRequestException);
  });
});
