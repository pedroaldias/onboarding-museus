import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

/**
 * CORS_ORIGIN="http://localhost:3001,https://meu-site.com" restringe as origens.
 * Sem a variável: liberado em desenvolvimento (comportamento anterior) e
 * bloqueado em produção, para não expor a API a qualquer site por esquecimento.
 */
function corsOrigin(): boolean | string[] {
  const raw = process.env.CORS_ORIGIN;
  if (raw) {
    return raw
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }
  return process.env.NODE_ENV !== 'production';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  app.enableCors({ origin: corsOrigin() });
  app.enableShutdownHooks(); // fecha a conexão do Prisma em SIGTERM/SIGINT
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
