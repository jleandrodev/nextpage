const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ Não configurada');
    
    // Testar conexão
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Conexão com banco de dados: SUCESSO');
    console.log('📋 Resultado do teste:', result);

    // Testar contagem de organizações
    const orgCount = await prisma.organization.count();
    console.log('📊 Número de organizações no banco:', orgCount);

    // Testar contagem de usuários
    const userCount = await prisma.user.count();
    console.log('👥 Número de usuários no banco:', userCount);

    // Testar contagem de ebooks
    const ebookCount = await prisma.ebook.count();
    console.log('📚 Número de ebooks no banco:', ebookCount);

  } catch (error) {
    console.error('❌ Erro na conexão com banco de dados:');
    console.error('🔍 Detalhes do erro:', error.message);
    
    if (error.code) {
      console.error('📋 Código do erro:', error.code);
    }
    
    if (error.meta) {
      console.error('📋 Meta do erro:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o teste
testDatabaseConnection();
