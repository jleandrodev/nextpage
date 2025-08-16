require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Variáveis do Supabase não configuradas');
  console.log('📝 Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBuckets() {
  console.log('🔍 Verificando buckets do Supabase Storage...\n');

  const requiredBuckets = [
    { id: 'logos', name: 'Logos', public: true },
    { id: 'login-images', name: 'Login Images', public: true },
    { id: 'ebook-covers', name: 'Ebook Covers', public: true },
    { id: 'ebooks', name: 'Ebooks', public: false },
    { id: 'uploads', name: 'Uploads', public: false },
  ];

  let allBucketsExist = true;

  for (const bucket of requiredBuckets) {
    try {
      const { data, error } = await supabase.storage.getBucket(bucket.id);

      if (error) {
        console.log(`❌ Bucket "${bucket.name}" (${bucket.id}): ${error.message}`);
        allBucketsExist = false;
      } else {
        console.log(`✅ Bucket "${bucket.name}" (${bucket.id}): Existe`);
        console.log(`   - Público: ${data.public ? 'Sim' : 'Não'}`);
        console.log(`   - Tamanho máximo: ${(data.file_size_limit / 1024 / 1024).toFixed(1)} MB`);
      }
    } catch (error) {
      console.log(`❌ Erro ao verificar bucket "${bucket.name}": ${error.message}`);
      allBucketsExist = false;
    }
  }

  console.log('\n📊 Resultado:');
  if (allBucketsExist) {
    console.log('🎉 Todos os buckets estão configurados!');
    console.log('✅ O upload em lote deve funcionar corretamente.');
  } else {
    console.log('❌ Alguns buckets estão faltando.');
    console.log('\n🔧 Para configurar os buckets:');
    console.log('1. Acesse o Supabase Dashboard');
    console.log('2. Vá para Storage > Buckets');
    console.log('3. Execute o script: scripts/setup-storage-policies.sql');
    console.log('4. Ou crie os buckets manualmente:');

    requiredBuckets.forEach((bucket) => {
      console.log(`   - ${bucket.id} (${bucket.public ? 'Público' : 'Privado'})`);
    });
  }
}

async function testUpload() {
  console.log('\n🧪 Testando upload...');

  try {
    // Testar upload de um arquivo pequeno
    const testContent = Buffer.from('Teste de upload');
    const fileName = `test-${Date.now()}.txt`;

    const { data, error } = await supabase.storage.from('ebooks').upload(fileName, testContent, {
      contentType: 'application/pdf',
      upsert: true,
    });

    if (error) {
      console.log(`❌ Erro no teste de upload: ${error.message}`);
      return false;
    }

    console.log(`✅ Upload de teste bem-sucedido: ${fileName}`);

    // Limpar arquivo de teste
    await supabase.storage.from('ebooks').remove([fileName]);
    console.log('🧹 Arquivo de teste removido');

    return true;
  } catch (error) {
    console.log(`❌ Erro no teste de upload: ${error.message}`);
    return false;
  }
}

async function main() {
  try {
    await checkBuckets();
    await testUpload();
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main();
