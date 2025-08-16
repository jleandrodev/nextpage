require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Variáveis do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listStorageFiles() {
  console.log('🔍 Listando arquivos no Supabase Storage...\n');

  const buckets = ['ebooks', 'ebook-covers', 'logos', 'login-images', 'uploads'];

  for (const bucket of buckets) {
    try {
      console.log(`📦 Bucket: ${bucket}`);

      const { data, error } = await supabase.storage.from(bucket).list();

      if (error) {
        console.log(`   ❌ Erro: ${error.message}`);
        continue;
      }

      if (data.length === 0) {
        console.log(`   📭 Vazio`);
      } else {
        console.log(`   📄 ${data.length} arquivo(s):`);
        data.forEach((file, index) => {
          const size = file.metadata?.size ? `(${(file.metadata.size / 1024).toFixed(1)} KB)` : '';
          console.log(`      ${index + 1}. ${file.name} ${size}`);
        });
      }

      console.log('');
    } catch (error) {
      console.log(`   ❌ Erro ao listar ${bucket}: ${error.message}\n`);
    }
  }
}

async function main() {
  try {
    await listStorageFiles();
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main();
