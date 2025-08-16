require('dotenv').config();
const { PDFDocument } = require('pdf-lib');
const { PdfConverterService } = require('../src/lib/services/pdf-converter.service');

async function testPdfConversion() {
  console.log('🧪 Testando conversão de PDF para imagem...\n');

  try {
    const pdfConverter = new PdfConverterService();

    // Teste 1: Verificar se o serviço está funcionando
    console.log('📋 Teste 1: Verificação básica do serviço...');
    const isWorking = await pdfConverter.testConversion();

    if (isWorking) {
      console.log('   ✅ Serviço funcionando corretamente');
    } else {
      console.log('   ❌ Serviço com problemas');
      return;
    }

    // Teste 2: Criar um PDF de teste mais complexo
    console.log('\n📋 Teste 2: Criando PDF de teste...');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    // Adicionar texto
    page.drawText('Ebook de Teste', {
      x: 50,
      y: 750,
      size: 24,
    });

    page.drawText('Primeira página do ebook', {
      x: 50,
      y: 720,
      size: 16,
    });

    page.drawText('Esta é uma página de teste para verificar', {
      x: 50,
      y: 680,
      size: 12,
    });

    page.drawText('a conversão de PDF para imagem PNG.', {
      x: 50,
      y: 660,
      size: 12,
    });

    const pdfBytes = await pdfDoc.save();
    console.log('   ✅ PDF de teste criado');

    // Teste 3: Converter para imagem
    console.log('\n📋 Teste 3: Convertendo PDF para imagem...');
    const startTime = Date.now();
    const imageBuffer = await pdfConverter.convertFirstPageToImage(pdfBytes);
    const endTime = Date.now();

    console.log(`   ✅ Conversão concluída em ${endTime - startTime}ms`);
    console.log(`   📊 Tamanho da imagem: ${(imageBuffer.length / 1024).toFixed(1)} KB`);

    // Teste 4: Verificar se é uma imagem PNG válida
    console.log('\n📋 Teste 4: Verificando formato da imagem...');
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const isPng = imageBuffer.subarray(0, 8).equals(pngSignature);

    if (isPng) {
      console.log('   ✅ Formato PNG válido');
    } else {
      console.log('   ❌ Formato inválido');
    }

    // Fechar o browser
    await pdfConverter.closeBrowser();

    console.log('\n🎉 Todos os testes passaram!');
    console.log('✅ A conversão de PDF para imagem está funcionando corretamente.');
  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error.message);

    if (error.message.includes('puppeteer')) {
      console.log('\n💡 Dicas para resolver problemas do Puppeteer:');
      console.log('   1. Verifique se o Chrome/Chromium está instalado');
      console.log('   2. Em ambientes Linux, pode ser necessário instalar dependências:');
      console.log(
        '      sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget',
      );
    }
  }
}

testPdfConversion();
