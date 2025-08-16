const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupImageBuckets() {
  try {
    console.log('🚀 Configurando buckets de imagens no Supabase Storage...');

    const buckets = [
      {
        name: 'logos',
        description: 'Logos das organizações',
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
      },
      {
        name: 'login-images',
        description: 'Imagens de fundo das páginas de login',
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      },
      {
        name: 'cover-hero',
        description: 'Imagens de capa dos catálogos',
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      },
    ];

    for (const bucket of buckets) {
      console.log(`📦 Criando bucket: ${bucket.name}`);
      
      // Criar bucket
      const { data: bucketData, error: bucketError } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.allowedMimeTypes,
        fileSizeLimit: bucket.fileSizeLimit,
      });

      if (bucketError) {
        if (bucketError.message.includes('already exists')) {
          console.log(`✅ Bucket ${bucket.name} já existe`);
        } else {
          console.error(`❌ Erro ao criar bucket ${bucket.name}:`, bucketError);
        }
      } else {
        console.log(`✅ Bucket ${bucket.name} criado com sucesso`);
      }

      // Configurar políticas de acesso público
      console.log(`🔐 Configurando políticas para bucket: ${bucket.name}`);
      
      const policies = [
        {
          name: 'Public read access',
          definition: `CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = '${bucket.name}')`,
        },
        {
          name: 'Authenticated users can upload',
          definition: `CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = '${bucket.name}' AND auth.role() = 'authenticated')`,
        },
        {
          name: 'Users can update own files',
          definition: `CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (bucket_id = '${bucket.name}' AND auth.uid()::text = (storage.foldername(name))[1])`,
        },
        {
          name: 'Users can delete own files',
          definition: `CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (bucket_id = '${bucket.name}' AND auth.uid()::text = (storage.foldername(name))[1])`,
        },
      ];

      for (const policy of policies) {
        try {
          const { error: policyError } = await supabase.rpc('exec_sql', {
            sql: policy.definition,
          });

          if (policyError) {
            if (policyError.message.includes('already exists')) {
              console.log(`✅ Política "${policy.name}" já existe para ${bucket.name}`);
            } else {
              console.error(`❌ Erro ao criar política "${policy.name}" para ${bucket.name}:`, policyError);
            }
          } else {
            console.log(`✅ Política "${policy.name}" criada para ${bucket.name}`);
          }
        } catch (error) {
          console.error(`❌ Erro ao executar política "${policy.name}" para ${bucket.name}:`, error);
        }
      }
    }

    console.log('\n🎉 Configuração dos buckets concluída!');
    console.log('\n📋 Resumo dos buckets criados:');
    console.log('• logos - Para logos das organizações (2MB max)');
    console.log('• login-images - Para imagens de fundo do login (5MB max)');
    console.log('• cover-hero - Para imagens de capa dos catálogos (5MB max)');
    
    console.log('\n⚠️  Nota: As políticas de acesso podem precisar ser configuradas manualmente no painel do Supabase se houver problemas com o script.');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupImageBuckets();
}

module.exports = { setupImageBuckets };
