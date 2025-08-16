const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '..', '.env');

  if (fs.existsSync(envPath)) {
    console.log('📄 Arquivo .env encontrado. Adicionando variáveis do Supabase...\n');

    let content = fs.readFileSync(envPath, 'utf8');

    // Verificar se as variáveis do Supabase já existem
    const hasSupabaseUrl = content.includes('NEXT_PUBLIC_SUPABASE_URL');
    const hasSupabaseAnonKey = content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const hasSupabaseServiceKey = content.includes('SUPABASE_SERVICE_ROLE_KEY');

    if (!hasSupabaseUrl || !hasSupabaseAnonKey || !hasSupabaseServiceKey) {
      // Extrair o project ID da DATABASE_URL
      const dbUrlMatch = content.match(/db\.([^.]+)\.supabase\.co/);
      const projectId = dbUrlMatch ? dbUrlMatch[1] : 'your-project-id';

      // Adicionar as variáveis do Supabase
      const supabaseVars = `
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://${projectId}.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
`;

      // Adicionar no final do arquivo
      content += supabaseVars;

      // Salvar o arquivo atualizado
      fs.writeFileSync(envPath, content);

      console.log('✅ Variáveis do Supabase adicionadas ao arquivo .env');
      console.log(`📝 Project ID detectado: ${projectId}`);
      console.log('\n🔧 Próximos passos:');
      console.log('1. Acesse https://supabase.com');
      console.log('2. Vá para Settings > API');
      console.log('3. Copie as chaves e substitua no arquivo .env:');
      console.log('   - Project URL → NEXT_PUBLIC_SUPABASE_URL');
      console.log('   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('   - service_role secret → SUPABASE_SERVICE_ROLE_KEY');
      console.log('\n4. Reinicie o servidor: npm run dev');
    } else {
      console.log('✅ Todas as variáveis do Supabase já estão configuradas!');
    }
  } else {
    console.log('❌ Arquivo .env não encontrado');
  }
} catch (error) {
  console.error('❌ Erro ao atualizar arquivo .env:', error.message);
}
