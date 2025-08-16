const fs = require('fs');
const path = require('path');

// Criar diretório temporário para os arquivos de teste
const testDir = path.join(__dirname, 'test-files');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Lista de ebooks fictícios para teste
const testEbooks = [
  'O Poder do Hábito.pdf',
  'Atomic Habits.pdf',
  'Deep Work.pdf',
  'A Única Coisa.pdf',
  'O Milagre da Manhã.pdf',
  'Como Fazer Amigos e Influenciar Pessoas.pdf',
  'Pense e Enriqueça.pdf',
  'O Monge e o Executivo.pdf',
  'A Sutil Arte de Ligar o Foda-se.pdf',
  'Mindset - A Nova Psicologia do Sucesso.pdf',
];

console.log('📚 Criando arquivos de teste...');

// Criar arquivos PDF fictícios (apenas para teste)
testEbooks.forEach((filename, index) => {
  const filePath = path.join(testDir, filename);

  // Criar um PDF simples com conteúdo de teste
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${filename.replace('.pdf', '')}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;

  fs.writeFileSync(filePath, pdfContent);
  console.log(`✅ Criado: ${filename}`);
});

console.log('\n📦 Arquivos de teste criados em:', testDir);
console.log('\n💡 Para testar o upload em lote:');
console.log('1. Compacte os arquivos em um ZIP');
console.log('2. Use o botão "Upload em Lote" na página de ebooks');
console.log('3. Selecione o arquivo ZIP criado');
