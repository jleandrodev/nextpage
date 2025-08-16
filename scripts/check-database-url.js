// Script para verificar se a DATABASE_URL está correta
console.log('🔍 Verificando DATABASE_URL...');

// Verificar se a variável existe
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL não está configurada');
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;

// Verificar formato básico
if (!dbUrl.startsWith('postgresql://')) {
  console.log('❌ DATABASE_URL deve começar com "postgresql://"');
  process.exit(1);
}

// Extrair componentes da URL
try {
  const url = new URL(dbUrl);

  console.log('✅ DATABASE_URL configurada');
  console.log('📋 Componentes da URL:');
  console.log(`   Protocolo: ${url.protocol}`);
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Porta: ${url.port}`);
  console.log(`   Database: ${url.pathname.slice(1)}`);
  console.log(`   Usuário: ${url.username}`);
  console.log(`   Senha: ${url.password ? '***configurada***' : '❌ não configurada'}`);

  // Verificar se é Supabase
  if (url.hostname.includes('supabase.co')) {
    console.log('✅ URL parece ser do Supabase');

    // Verificar project ID
    const projectId = url.hostname.split('.')[1];
    console.log(`   Project ID: ${projectId}`);

    // Verificar se o project ID está correto
    if (projectId === 'bwitysxhadrcibputahk') {
      console.log('✅ Project ID correto');
    } else {
      console.log('⚠️  Project ID pode estar incorreto');
    }
  } else {
    console.log('⚠️  URL não parece ser do Supabase');
  }
} catch (error) {
  console.log('❌ Erro ao analisar DATABASE_URL:', error.message);
  process.exit(1);
}

console.log('\n📝 PRÓXIMOS PASSOS:');
console.log('1. Verifique se o banco está online no Supabase');
console.log('2. Verifique se a senha está correta');
console.log('3. Teste a conexão localmente');
