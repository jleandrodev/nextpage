const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// Criar um ZIP de teste com os arquivos PDF já criados
async function createTestZip() {
  const testDir = path.join(__dirname, 'test-files');
  const zip = new JSZip();

  console.log('📦 Criando ZIP de teste...');

  // Adicionar todos os arquivos PDF ao ZIP
  const files = fs.readdirSync(testDir);

  for (const file of files) {
    if (file.endsWith('.pdf')) {
      const filePath = path.join(testDir, file);
      const fileContent = fs.readFileSync(filePath);
      zip.file(file, fileContent);
      console.log(`✅ Adicionado ao ZIP: ${file}`);
    }
  }

  // Salvar o ZIP
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  const zipPath = path.join(__dirname, 'test-ebooks.zip');
  fs.writeFileSync(zipPath, zipBuffer);

  console.log(`\n🎉 ZIP criado com sucesso: ${zipPath}`);
  console.log(`📊 Tamanho: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📚 Arquivos incluídos: ${files.filter((f) => f.endsWith('.pdf')).length}`);

  return zipPath;
}

// Função principal
async function main() {
  try {
    // Verificar se os arquivos de teste existem
    const testDir = path.join(__dirname, 'test-files');
    if (!fs.existsSync(testDir)) {
      console.log('❌ Diretório de teste não encontrado. Execute primeiro: npm run test:create-ebooks');
      return;
    }

    const files = fs.readdirSync(testDir).filter((f) => f.endsWith('.pdf'));
    if (files.length === 0) {
      console.log('❌ Nenhum arquivo PDF encontrado. Execute primeiro: npm run test:create-ebooks');
      return;
    }

    // Criar o ZIP
    const zipPath = await createTestZip();

    console.log('\n🚀 Para testar o upload em lote:');
    console.log('1. Acesse http://localhost:3000/admin/ebooks');
    console.log('2. Clique em "Upload em Lote"');
    console.log('3. Arraste e solte o arquivo:', zipPath);
    console.log('4. Configure os valores padrão');
    console.log('5. Clique em "Iniciar Upload"');

    console.log('\n⚠️  Nota: Você precisará configurar as variáveis de ambiente do Supabase');
    console.log('   para que o upload funcione completamente. Veja: config/env-setup.md');
  } catch (error) {
    console.error('❌ Erro ao criar ZIP de teste:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { createTestZip };
