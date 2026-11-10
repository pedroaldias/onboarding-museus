// Roda antes de cada arquivo de teste: aponta o Prisma para um banco separado,
// para que os testes NÃO apaguem os dados de desenvolvimento (dev.db).
process.env.DATABASE_URL = 'file:./test.db';
