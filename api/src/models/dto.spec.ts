import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAttractionDto, UpdateAttractionDto } from './attraction.dto';
import { CreateWorkDto } from './work.dto';

async function check<T extends object>(cls: new () => T, plain: object) {
  const instance = plainToInstance(cls, plain);
  const errors = await validate(instance, { whitelist: true });
  return { instance, errors };
}

describe('DTOs', () => {
  it('remove espaços nas pontas antes de validar', async () => {
    const { instance, errors } = await check(CreateAttractionDto, {
      name: '  Museu Théo Brandão  ',
      description: ' Maceió ',
    });
    expect(errors).toHaveLength(0);
    expect(instance.name).toBe('Museu Théo Brandão');
    expect(instance.description).toBe('Maceió');
  });

  it('rejeita nome só com espaços', async () => {
    const { errors } = await check(CreateAttractionDto, {
      name: '   ',
      description: 'x',
    });
    expect(errors.map((e) => e.property)).toContain('name');
  });

  it('rejeita textos acima do limite', async () => {
    const { errors } = await check(CreateWorkDto, {
      title: 'a'.repeat(201),
      author: 'x',
      description: 'x',
    });
    expect(errors.map((e) => e.property)).toContain('title');
  });

  it('PATCH aceita só um campo, mas valida o enviado', async () => {
    const ok = await check(UpdateAttractionDto, { name: 'Novo' });
    expect(ok.errors).toHaveLength(0);

    const bad = await check(UpdateAttractionDto, { name: '   ' });
    expect(bad.errors.map((e) => e.property)).toContain('name');
  });
});
