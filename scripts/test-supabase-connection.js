const { PrismaClient } = require('@prisma/client');

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão direta com Supabase...');
  
  // URL com SSL
  const databaseUrl = 'postgresql://postgres:Jj-78955123@db.bwitysxhadrcibputahk.supabase.co:5432/postgres?sslmode=require';
  
  console.log('📋 Configurações:');
  console.log(`   URL: ${databaseUrl.substring(0, 50)}...`);
  console.log(`   SSL: ${databaseUrl.includes('sslmode=require') ? '✅ Configurado' : '❌ Não configurado'}`);
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    console.log('\n🔍 Teste 1: Conexão básica...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Conexão básica: SUCESSO');
    console.log('   Resultado:', result);

    console.log('\n🔍 Teste 2: Contagem de organizações...');
    const orgCount = await prisma.organization.count();
    console.log('✅ Contagem de organizações: SUCESSO');
    console.log(`   Total: ${orgCount} organizações`);

    console.log('\n🔍 Teste 3: Query de organizações...');
    const orgs = await prisma.organization.findMany({
      take: 3,
      select: { id: true, name: true, slug: true },
    });
    console.log('✅ Query de organizações: SUCESSO');
    console.log('   Organizações:', orgs);

    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('   A conexão local está funcionando perfeitamente.');
    console.log('   O problema pode estar na configuração da Vercel.');

  } catch (error) {
    console.error('\n❌ ERRO NA CONEXÃO:');
    console.error('   Mensagem:', error.message);
    console.error('   Código:', error.code);
    console.error('   Meta:', error.meta);
    
    console.log('\n🔍 POSSÍVEIS CAUSAS:');
    console.log('   1. Senha incorreta');
    console.log('   2. Project ID incorreto');
    console.log('   3. Banco offline');
    console.log('   4. Configuração SSL incorreta');
  } finally {
    await prisma.$disconnect();
  }
}

testSupabaseConnection();
