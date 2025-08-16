require('dotenv').config();

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testando API...\n');

  try {
    // Teste 1: Verificar sessão
    console.log('1. Testando endpoint de sessão...');
    const response = await fetch(`${BASE_URL}/api/auth/session`);
    console.log('Status:', response.status);
    console.log('OK\n');

    // Teste 2: Verificar upload de ebooks
    console.log('2. Testando endpoint de upload de ebooks...');
    const response2 = await fetch(`${BASE_URL}/api/upload-ebooks-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: true,
      }),
    });
    console.log('Status:', response2.status);
    
    if (response2.ok) {
      const data = await response2.json();
      console.log('Resposta:', data);
    } else {
      console.log('Erro na resposta');
    }
    console.log('OK\n');

    // Teste 3: Verificar outras rotas
    console.log('3. Testando outras rotas...');
    const routes = [
      '/api/admin/organizations',
      '/api/ebooks',
      '/api/user/profile'
    ];

    for (const route of routes) {
      try {
        const res = await fetch(`${BASE_URL}${route}`);
        console.log(`${route}: ${res.status}`);
      } catch (error) {
        console.log(`${route}: Erro - ${error.message}`);
      }
    }

    console.log('\n✅ Todos os testes concluídos!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse http://localhost:3000/admin/ebooks');
    console.log('2. Teste o upload de ebooks');
    console.log('3. Verifique se as imagens estão sendo geradas');

  } catch (error) {
    console.error('❌ Erro nos testes:', error);
  }
}

testAPI();
