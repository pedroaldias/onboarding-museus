# API Atrações e Obras (NestJS + Prisma + SQLite)

## 1. Criar o projeto
```bash
npm i -g @nestjs/cli
nest new museum-api        # escolha npm
cd museum-api
npm i @prisma/client@6 class-validator class-transformer @nestjs/mapped-types
npm i -D prisma@6
npx prisma init --datasource-provider sqlite
```

## 2. Copiar os arquivos deste starter
- Substitua `prisma/schema.prisma`
- Substitua a pasta `src/` (apague `app.controller*` e `app.service.ts` gerados)
- Confira no `.env`: `DATABASE_URL="file:./dev.db"`

## 3. Migrar e rodar
```bash
npx prisma migrate dev --name init
npm run start:dev
```

## 4. Testar
```bash
curl -X POST localhost:3000/api/attraction -H "Content-Type: application/json" \
  -d '{"name":"Museu Théo Brandão","description":"Museu de Antropologia e Folclore em Maceió"}'

curl -X POST localhost:3000/api/attraction/1/work -H "Content-Type: application/json" \
  -d '{"title":"Estátua de Anúbis","author":"Desconhecido","description":"Escultura em basalto, 500 a.C."}'

curl localhost:3000/api/attraction/1/work
```

## 5. Git
```bash
git init && git checkout -b develop
```
