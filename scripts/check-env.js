require('dotenv').config();

console.log('🔍 Verificando variáveis de ambiente...\n');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

const optionalVars = ['PADDLE_API_KEY', 'PADDLE_WEBHOOK_SECRET'];

console.log('📋 Variáveis obrigatórias:');
let allRequiredPresent = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NÃO CONFIGURADA`);
    allRequiredPresent = false;
  }
});

console.log('\n📋 Variáveis opcionais:');
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`⚠️  ${varName}: Não configurada (opcional)`);
  }
});

console.log('\n📊 Resultado:');
if (allRequiredPresent) {
  console.log('🎉 Todas as variáveis obrigatórias estão configuradas!');
  console.log('✅ O upload em lote deve funcionar corretamente.');
} else {
  console.log('❌ Algumas variáveis obrigatórias estão faltando.');
  console.log('📝 Configure as variáveis no arquivo .env e reinicie o servidor.');
  console.log('📖 Veja o arquivo env-template.txt para um exemplo.');
}

console.log('\n💡 Dica: Se você tem um arquivo .env mas ele não está sendo detectado,');
console.log('   verifique se não há um arquivo .cursorignore bloqueando o acesso.');
