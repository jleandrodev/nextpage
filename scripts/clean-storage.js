require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Variáveis do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanStorage() {
  console.log('🧹 Limpando arquivos do Supabase Storage...\n');

  const buckets = ['ebooks', 'ebook-covers'];

  for (const bucket of buckets) {
    try {
      console.log(`📦 Limpando bucket: ${bucket}`);

      const { data, error } = await supabase.storage.from(bucket).list();

      if (error) {
        console.log(`   ❌ Erro: ${error.message}`);
        continue;
      }

      if (data.length === 0) {
        console.log(`   ✅ Já está vazio`);
        continue;
      }

      // Filtrar arquivos (excluir placeholders)
      const filesToDelete = data.filter((file) => !file.name.startsWith('.')).map((file) => file.name);

      if (filesToDelete.length === 0) {
        console.log(`   ✅ Nenhum arquivo para deletar`);
        continue;
      }

      console.log(`   🗑️  Deletando ${filesToDelete.length} arquivo(s)...`);

      const { error: deleteError } = await supabase.storage.from(bucket).remove(filesToDelete);

      if (deleteError) {
        console.log(`   ❌ Erro ao deletar: ${deleteError.message}`);
      } else {
        console.log(`   ✅ ${filesToDelete.length} arquivo(s) deletado(s)`);
      }
    } catch (error) {
      console.log(`   ❌ Erro ao limpar ${bucket}: ${error.message}`);
    }

    console.log('');
  }
}

async function main() {
  try {
    await cleanStorage();
    console.log('🎉 Limpeza concluída!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main();
