import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Configuração HTTP compartilhada entre main.ts e os testes e2e.
 * Manter num único lugar evita que os testes validem uma app diferente da de produção.
 */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}
