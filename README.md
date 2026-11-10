# Atrações e Obras (Museus)

Aplicação no domínio de museus. Uma **Atração** representa um museu (ex.: Museu Théo Brandão) e uma **Obra** está sempre vinculada a uma atração (ex.: "Estátua de Anúbis").

O repositório é um monorepo com três aplicações:

| Pasta     | O que é                                   | Tecnologias                          | Porta padrão |
|-----------|-------------------------------------------|--------------------------------------|--------------|
| `api/`    | API REST: criação e consulta dos dados    | NestJS, Prisma, SQLite               | 3000         |
| `web/`    | Plataforma de administração (cadastro e listagem) | Next.js (App Router), React, Tailwind | 3001 (veja abaixo) |
| `mobile/` | App que exibe atrações e obras (somente leitura)  | Flutter, pacote `http`               | n/a          |

```
Flutter (mobile) ─┐
                  ├──► API NestJS ──► Prisma ──► SQLite
Next.js (web)  ───┘
```

## Pré-requisitos

- **Node.js 22.12 ou superior** (exigido pelo `web`) e npm
- **Flutter** com Dart SDK `^3.13.7` (somente para o `mobile`)

## Como rodar

Suba a API primeiro: o web e o mobile dependem dela.

### 1. API (`api/`)

```bash
cd api
npm install
cp .env.example .env          # DATABASE_URL="file:./dev.db"
npx prisma migrate dev        # cria o banco SQLite e aplica as migrations
npm run start:dev             # http://localhost:3000/api
```

Variáveis de ambiente (`api/.env`):

| Variável       | Padrão            | Descrição |
|----------------|-------------------|-----------|
| `DATABASE_URL` | `file:./dev.db`   | Caminho do banco SQLite |
| `PORT`         | `3000`            | Porta da API |
| `CORS_ORIGIN`  | (vazia)           | Origens permitidas, separadas por vírgula (ex.: `http://localhost:3001`). Sem a variável, o CORS fica liberado em desenvolvimento e **bloqueado em produção**. Em produção ela é obrigatória. |

Para rodar em produção: `npm run build && npm run start:prod`.

### 2. Web (`web/`)

A API já usa a porta 3000, então rode o Next.js em outra porta:

```bash
cd web
npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:3000/api
npm run dev -- -p 3001        # http://localhost:3001
```

Se mudar a porta do web, lembre de incluí-la em `CORS_ORIGIN` na API.

| Variável               | Padrão                      | Descrição |
|------------------------|-----------------------------|-----------|
| `NEXT_PUBLIC_API_URL`  | `http://localhost:3000/api` | URL base da API |

Páginas:

- `/`: lista de atrações
- `/attractions/new`: cadastro de nova atração
- `/attractions/:id`: obras da atração, formulário de nova obra e edição da atração

### 3. Mobile (`mobile/`)

```bash
cd mobile
flutter pub get
flutter run -d chrome         # usa http://localhost:3000/api
```

O endereço da API muda sem alterar o código, com `--dart-define`:

| Onde vai rodar        | Comando |
|-----------------------|---------|
| Chrome                | `flutter run -d chrome` |
| Emulador Android      | `flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api` |
| iPhone / celular real | `flutter run --dart-define=API_BASE_URL=http://IP_DO_PC:3000/api` |

No emulador Android, `localhost` aponta para o próprio emulador. Por isso se usa `10.0.2.2`, que é o endereço do computador hospedeiro. Em celular real, o aparelho e o computador precisam estar na mesma rede.

O app tem duas telas: lista de atrações e, ao tocar em uma, as obras dela. Não cria nem edita dados.

## Endpoints da API

Prefixo global: `/api`.

| Método   | Rota                            | Descrição                  | Resposta |
|----------|---------------------------------|----------------------------|----------|
| `GET`    | `/attraction`                   | Lista as atrações          | 200 |
| `POST`   | `/attraction`                   | Cria uma atração           | 201 |
| `GET`    | `/attraction/:id`               | Busca uma atração          | 200 / 404 |
| `PATCH`  | `/attraction/:id`               | Atualiza (parcial)         | 200 / 404 |
| `DELETE` | `/attraction/:id`               | Remove a atração e suas obras (cascata) | 204 / 404 |
| `GET`    | `/attraction/:id/work`          | Lista as obras da atração  | 200 / 404 |
| `POST`   | `/attraction/:id/work`          | Cria uma obra na atração   | 201 / 404 |
| `DELETE` | `/attraction/:id/work/:workId`  | Remove uma obra            | 204 / 404 |

Exemplos:

```bash
curl -X POST localhost:3000/api/attraction \
  -H "Content-Type: application/json" \
  -d '{"name":"Museu Théo Brandão","description":"Museu de Antropologia e Folclore em Maceió"}'

curl -X POST localhost:3000/api/attraction/1/work \
  -H "Content-Type: application/json" \
  -d '{"title":"Estátua de Anúbis","author":"Desconhecido","description":"Escultura em basalto, 500 a.C."}'

curl localhost:3000/api/attraction/1/work
```

Regras de validação:

- Todos os campos de texto são obrigatórios, ficam sem espaços nas pontas (um valor só com espaços é rejeitado) e campos desconhecidos são descartados.
- Limites: `name`, `title` e `author` até 200 caracteres; `description` até 5000.
- Ids na URL devem ser inteiros positivos. Um id inválido retorna **400**.

## Modelo de dados

```prisma
model Attraction {
  id          Int    @id @default(autoincrement())
  name        String
  description String
  works       Work[]
}

model Work {
  id            Int        @id @default(autoincrement())
  attraction_id Int        // índice + ON DELETE CASCADE
  title         String
  author        String
  description   String
}
```

## Estrutura do projeto

```
api/
  prisma/               schema e migrations
  src/
    controllers/        rotas HTTP
    services/           regras de negócio
    repositories/       acesso ao banco (Prisma)
    models/             DTOs e validação
    pipes/              validação de ids
  test/                 testes e2e
web/src/
  app/                  rotas (App Router)
  components/           formulários e componentes de exibição
  hooks/                estado e chamadas à API
  services/             cliente HTTP
  models/               tipos
mobile/lib/
  models/               classes de dados
  services/             consumo da API
  screens/              telas
  widgets/              componentes reutilizáveis
  config/               endereço da API
```

## Testes

```bash
# API: unitários e e2e (os e2e usam um banco separado, test.db, e não tocam no dev.db)
cd api && npm test
cd api && npm run test:e2e

# Web
cd web && npm test

# Mobile
cd mobile && flutter test
```

Lint: `npm run lint` em `api/` e em `web/`.

## Fluxo de versionamento

O desenvolvimento acontece na branch `develop`. Quando as funcionalidades estão prontas, é feito o merge para a `master`.
