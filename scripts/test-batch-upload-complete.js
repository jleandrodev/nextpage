require('dotenv').config();
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

console.log('🧪 Teste completo de upload em lote...\n');

// Verificar se o arquivo de teste existe
const testZipPath = path.join(__dirname, '..', 'test-ebooks.zip');
if (!fs.existsSync(testZipPath)) {
  console.log('❌ Arquivo test-ebooks.zip não encontrado');
  console.log('💡 Execute primeiro: npm run test:create-zip');
  process.exit(1);
}

async function testBatchUpload() {
  try {
    console.log('1. Preparando dados...');
    
    // Criar FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testZipPath));
    formData.append('defaultAuthor', 'Autor Teste');
    formData.append('defaultCategory', 'Teste');
    formData.append('defaultPointsCost', '1');
    formData.append('organizationId', 'test-org-id');

    console.log('2. Enviando requisição...');
    const response = await fetch(`${BASE_URL}/api/upload-ebooks-batch`, {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Upload realizado com sucesso!');
      console.log('Resultado:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Erro no upload:');
      console.log(errorText);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

async function testSession() {
  try {
    console.log('\n3. Testando sessão...');
    const serverResponse = await fetch(`${BASE_URL}/api/auth/session`);
    console.log('Status da sessão:', serverResponse.status);
    
    if (serverResponse.ok) {
      const sessionData = await serverResponse.json();
      console.log('Sessão:', sessionData);
    }
  } catch (error) {
    console.log('Erro ao verificar sessão:', error.message);
  }
}

async function main() {
  await testBatchUpload();
  await testSession();
  
  console.log('\n📋 Próximos passos:');
  console.log('1. Verifique os logs do servidor');
  console.log('2. Confirme se os ebooks foram criados');
  console.log('3. Teste o download dos ebooks');
}

main().catch(console.error);
