import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

describe('API Atrações e Obras (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const attractionData = {
    name: 'Museu Théo Brandão',
    description: 'Museu de Antropologia e Folclore em Maceió',
  };
  const workData = {
    title: 'Estátua de Anúbis',
    author: 'Desconhecido',
    description: 'Escultura em basalto, 500 a.C.',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app); // mesma configuração do main.ts
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.work.deleteMany();
    await prisma.attraction.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  async function createAttraction() {
    const res = await http().post('/api/attraction').send(attractionData).expect(201);
    return res.body as { id: number; name: string; description: string };
  }

  describe('Atrações', () => {
    it('POST cria uma atração', async () => {
      const res = await http().post('/api/attraction').send(attractionData).expect(201);
      expect(res.body).toMatchObject(attractionData);
      expect(res.body.id).toEqual(expect.any(Number));
    });

    it('POST com nome vazio ou só espaços retorna 400', async () => {
      await http().post('/api/attraction').send({ name: '', description: 'x' }).expect(400);
      await http().post('/api/attraction').send({ name: '   ', description: 'x' }).expect(400);
    });

    it('POST remove espaços nas pontas antes de gravar', async () => {
      const res = await http()
        .post('/api/attraction')
        .send({ name: '  Museu  ', description: ' Desc ' })
        .expect(201);
      expect(res.body).toMatchObject({ name: 'Museu', description: 'Desc' });
    });

    it('GET lista, busca por id e retorna 404 quando não existe', async () => {
      const created = await createAttraction();
      const list = await http().get('/api/attraction').expect(200);
      expect(list.body).toHaveLength(1);
      await http().get(`/api/attraction/${created.id}`).expect(200);
      await http().get('/api/attraction/999').expect(404);
    });

    it('ids inválidos ou fora do intervalo retornam 400 (não 500)', async () => {
      await http().get('/api/attraction/abc').expect(400);
      await http().get('/api/attraction/0').expect(400);
      await http().get('/api/attraction/99999999999').expect(400);
    });

    it('PATCH altera só os campos enviados e retorna 404 quando não existe', async () => {
      const created = await createAttraction();
      const res = await http()
        .patch(`/api/attraction/${created.id}`)
        .send({ name: 'Novo nome' })
        .expect(200);
      expect(res.body.name).toBe('Novo nome');
      expect(res.body.description).toBe(attractionData.description);
      await http().patch('/api/attraction/999').send({ name: 'x' }).expect(404);
    });

    it('DELETE apaga a atração e retorna 404 na segunda vez', async () => {
      const created = await createAttraction();
      await http().delete(`/api/attraction/${created.id}`).expect(204);
      await http().delete(`/api/attraction/${created.id}`).expect(404);
    });
  });

  describe('Obras', () => {
    it('POST cria a obra na atração; 404 se a atração não existe; 400 se inválida', async () => {
      const a = await createAttraction();
      const res = await http().post(`/api/attraction/${a.id}/work`).send(workData).expect(201);
      expect(res.body).toMatchObject({ ...workData, attraction_id: a.id });
      await http().post('/api/attraction/999/work').send(workData).expect(404);
      await http()
        .post(`/api/attraction/${a.id}/work`)
        .send({ ...workData, title: '' })
        .expect(400);
    });

    it('GET lista só as obras da atração; [] sem obras; 404 sem atração', async () => {
      const a1 = await createAttraction();
      const a2 = await createAttraction();
      await http().post(`/api/attraction/${a1.id}/work`).send(workData).expect(201);

      const r1 = await http().get(`/api/attraction/${a1.id}/work`).expect(200);
      const r2 = await http().get(`/api/attraction/${a2.id}/work`).expect(200);
      expect(r1.body).toHaveLength(1);
      expect(r2.body).toEqual([]);
      await http().get('/api/attraction/999/work').expect(404);
    });

    it('DELETE apaga a obra; 404 se pertencer a outra atração', async () => {
      const a1 = await createAttraction();
      const a2 = await createAttraction();
      const work = await http().post(`/api/attraction/${a1.id}/work`).send(workData).expect(201);

      await http().delete(`/api/attraction/${a2.id}/work/${work.body.id}`).expect(404);
      await http().delete(`/api/attraction/${a1.id}/work/${work.body.id}`).expect(204);
      const list = await http().get(`/api/attraction/${a1.id}/work`).expect(200);
      expect(list.body).toHaveLength(0);
    });

    it('apagar a atração apaga as obras dela (cascade)', async () => {
      const a = await createAttraction();
      await http().post(`/api/attraction/${a.id}/work`).send(workData).expect(201);
      await http().delete(`/api/attraction/${a.id}`).expect(204);
      expect(await prisma.work.count()).toBe(0);
    });
  });
});
