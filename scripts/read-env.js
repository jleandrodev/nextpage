const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '..', '.env');

  if (fs.existsSync(envPath)) {
    console.log('📄 Conteúdo do arquivo .env:\n');
    const content = fs.readFileSync(envPath, 'utf8');
    console.log(content);
  } else {
    console.log('❌ Arquivo .env não encontrado na raiz do projeto');
  }
} catch (error) {
  console.error('❌ Erro ao ler arquivo .env:', error.message);
}
