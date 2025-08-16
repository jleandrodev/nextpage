const { PrismaClient } = require('@prisma/client');

// Cliente para SQLite (dados antigos)
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db',
    },
  },
});

// Cliente para Supabase PostgreSQL (novo)
const supabasePrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // URL do Supabase
    },
  },
});

async function migrateData() {
  console.log('🚀 Iniciando migração para Supabase...');

  try {
    // 1. Migrar organizações
    console.log('📊 Migrando organizações...');
    const organizations = await sqlitePrisma.organization.findMany();
    for (const org of organizations) {
      await supabasePrisma.organization.upsert({
        where: { id: org.id },
        update: org,
        create: org,
      });
    }
    console.log(`✅ ${organizations.length} organizações migradas`);

    // 2. Migrar usuários
    console.log('👥 Migrando usuários...');
    const users = await sqlitePrisma.user.findMany();
    for (const user of users) {
      await supabasePrisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }
    console.log(`✅ ${users.length} usuários migrados`);

    // 3. Migrar ebooks
    console.log('📚 Migrando ebooks...');
    const ebooks = await sqlitePrisma.ebook.findMany();
    for (const ebook of ebooks) {
      await supabasePrisma.ebook.upsert({
        where: { id: ebook.id },
        update: ebook,
        create: ebook,
      });
    }
    console.log(`✅ ${ebooks.length} ebooks migrados`);

    // 4. Migrar histórico de pontos
    console.log('💰 Migrando histórico de pontos...');
    const pointsHistory = await sqlitePrisma.pointsHistory.findMany();
    for (const history of pointsHistory) {
      await supabasePrisma.pointsHistory.upsert({
        where: { id: history.id },
        update: history,
        create: history,
      });
    }
    console.log(`✅ ${pointsHistory.length} registros de pontos migrados`);

    // 5. Migrar resgates
    console.log('🎁 Migrando resgates...');
    const redemptions = await sqlitePrisma.redemption.findMany();
    for (const redemption of redemptions) {
      await supabasePrisma.redemption.upsert({
        where: { id: redemption.id },
        update: redemption,
        create: redemption,
      });
    }
    console.log(`✅ ${redemptions.length} resgates migrados`);

    // 6. Migrar importações
    console.log('📋 Migrando importações...');
    const imports = await sqlitePrisma.pointsImport.findMany();
    for (const import_ of imports) {
      await supabasePrisma.pointsImport.upsert({
        where: { id: import_.id },
        update: import_,
        create: import_,
      });
    }
    console.log(`✅ ${imports.length} importações migradas`);

    console.log('🎉 Migração concluída com sucesso!');
    console.log('');
    console.log('📊 Resumo da migração:');
    console.log(`   • Organizações: ${organizations.length}`);
    console.log(`   • Usuários: ${users.length}`);
    console.log(`   • Ebooks: ${ebooks.length}`);
    console.log(`   • Histórico de pontos: ${pointsHistory.length}`);
    console.log(`   • Resgates: ${redemptions.length}`);
    console.log(`   • Importações: ${imports.length}`);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await sqlitePrisma.$disconnect();
    await supabasePrisma.$disconnect();
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };
