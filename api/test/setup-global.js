// Roda uma vez antes de todos os testes: cria/atualiza as tabelas do banco de teste.
const { execSync } = require('child_process');

module.exports = async () => {
  process.env.DATABASE_URL = 'file:./test.db';
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
};
