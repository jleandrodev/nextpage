// Script para verificar e corrigir DATABASE_URL
console.log('🔍 Verificando e corrigindo DATABASE_URL...');

// URL atual (sem parâmetros SSL)
const currentUrl = 'postgresql://postgres:Jj-78955123@db.bwitysxhadrcibputahk.supabase.co:5432/postgres';

// URL corrigida com parâmetros SSL
const correctedUrl = 'postgresql://postgres:Jj-78955123@db.bwitysxhadrcibputahk.supabase.co:5432/postgres?sslmode=require';

console.log('📋 URLs:');
console.log(`   Atual: ${currentUrl}`);
console.log(`   Corrigida: ${correctedUrl}`);

console.log('\n📝 INSTRUÇÕES PARA VERCEL:');
console.log('1. Acesse: https://vercel.com/dashboard/[seu-projeto]/settings/environment-variables');
console.log('2. Edite a variável DATABASE_URL');
console.log('3. Substitua o valor por:');
console.log(`   ${correctedUrl}`);
console.log('4. Salve as configurações');
console.log('5. Faça um novo deploy');

console.log('\n🔍 PARÂMETROS SSL ADICIONADOS:');
console.log('   ?sslmode=require - Força conexão SSL');
console.log('   Isso resolve problemas de conexão com Supabase');
