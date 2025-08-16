const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupCoverHeroBucket() {
  try {
    console.log('🚀 Configurando bucket cover-hero...');

    // Criar bucket cover-hero
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('cover-hero', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/*'],
    });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket cover-hero já existe');
      } else {
        console.error('❌ Erro ao criar bucket:', bucketError);
        return;
      }
    } else {
      console.log('✅ Bucket cover-hero criado com sucesso');
    }

    // Configurar políticas de acesso
    console.log('🔐 Configurando políticas de acesso...');

    // Política para acesso público (SELECT)
    const { error: selectPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Cover hero images são acessíveis publicamente" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'cover-hero');
      `,
    });

    if (selectPolicyError) {
      console.error('❌ Erro ao criar política de SELECT:', selectPolicyError);
    } else {
      console.log('✅ Política de SELECT criada');
    }

    // Política para upload apenas por admins (INSERT)
    const { error: insertPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Apenas admins podem fazer upload de cover hero images" 
        ON storage.objects FOR INSERT 
        WITH CHECK (
          bucket_id = 'cover-hero' AND 
          auth.role() = 'authenticated' AND
          EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::text 
            AND users.role = 'ADMIN_MASTER'
          )
        );
      `,
    });

    if (insertPolicyError) {
      console.error('❌ Erro ao criar política de INSERT:', insertPolicyError);
    } else {
      console.log('✅ Política de INSERT criada');
    }

    console.log('🎉 Configuração do bucket cover-hero concluída!');
    console.log('📝 Para usar, faça upload de imagens para o bucket "cover-hero"');
    console.log(
      '🔗 URLs serão no formato: https://[project].supabase.co/storage/v1/object/public/cover-hero/[filename]',
    );
  } catch (error) {
    console.error('❌ Erro durante configuração:', error);
  }
}

setupCoverHeroBucket();
