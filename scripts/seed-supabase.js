const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedSupabase() {
  console.log('🌱 Iniciando seed do Supabase...');

  try {
    // Limpar dados existentes
    console.log('🗑️  Limpando dados existentes...');
    await prisma.pointsHistory.deleteMany();
    await prisma.redemption.deleteMany();
    await prisma.pointsImport.deleteMany();
    await prisma.ebook.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    console.log('✅ Dados anteriores removidos');

    // Criar admin master
    console.log('👤 Criando admin master...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        cpf: '00000000000',
        email: 'admin@bancaonline.com',
        fullName: 'Administrador Master',
        password: adminPassword,
        role: 'ADMIN_MASTER',
        points: 0,
        firstAccess: false,
        isActive: true,
      },
    });

    console.log('✅ Admin master criado');

    // Criar organizações de exemplo
    console.log('🏢 Criando organizações...');
    const org1 = await prisma.organization.create({
      data: {
        name: 'Livraria Exemplo',
        cnpj: '12345678000199',
        slug: 'livraria-exemplo',
        logoUrl: '/images/logoipsum.png',
        loginImageUrl: '/images/login-paisagem.jpg',
        isActive: true,
      },
    });

    const org2 = await prisma.organization.create({
      data: {
        name: 'Café & Leitura',
        cnpj: '98765432000188',
        slug: 'cafe-leitura',
        logoUrl: '/images/logoipsum.png',
        loginImageUrl: '/images/mulher-tablet.jpg',
        isActive: true,
      },
    });

    console.log('✅ Organizações criadas');

    // Criar ebooks de exemplo
    console.log('📚 Criando ebooks...');
    const ebooks = await Promise.all([
      prisma.ebook.create({
        data: {
          title: 'O Poder do Hábito',
          author: 'Charles Duhigg',
          description: 'Como entender e transformar os padrões que governam nossas vidas.',
          category: 'Desenvolvimento Pessoal',
          coverImageUrl: '/images/desenvolvimentopessoal.jpg',
          pointsCost: 1,
          isActive: true,
          organizationId: null, // Disponível para todas
        },
      }),
      prisma.ebook.create({
        data: {
          title: 'Pai Rico, Pai Pobre',
          author: 'Robert Kiyosaki',
          description: 'O que os ricos ensinam a seus filhos sobre dinheiro.',
          category: 'Finanças',
          coverImageUrl: '/images/financas.jpg',
          pointsCost: 1,
          isActive: true,
          organizationId: null,
        },
      }),
      prisma.ebook.create({
        data: {
          title: 'A Arte da Guerra',
          author: 'Sun Tzu',
          description: 'Estratégias milenares aplicadas aos negócios e à vida.',
          category: 'Estratégia',
          coverImageUrl: '/images/autoajuda.jpg',
          pointsCost: 1,
          isActive: true,
          organizationId: org1.id, // Exclusivo da Livraria Exemplo
        },
      }),
      prisma.ebook.create({
        data: {
          title: 'Mindset',
          author: 'Carol Dweck',
          description: 'A nova psicologia do sucesso.',
          category: 'Psicologia',
          coverImageUrl: '/images/desenvolvimentopessoal.jpg',
          pointsCost: 1,
          isActive: true,
          organizationId: org2.id, // Exclusivo do Café & Leitura
        },
      }),
      prisma.ebook.create({
        data: {
          title: 'As Aventuras de Robinson Crusoé',
          author: 'Daniel Defoe',
          description: 'O clássico romance de aventura.',
          category: 'Literatura',
          coverImageUrl: '/images/aventura.jpg',
          pointsCost: 1,
          isActive: true,
          organizationId: null,
        },
      }),
    ]);

    console.log('✅ Ebooks criados');

    // Criar usuários de teste
    console.log('👥 Criando usuários de teste...');
    const userPassword = await bcrypt.hash('senha123', 12);

    const users = await Promise.all([
      prisma.user.create({
        data: {
          cpf: '12345678901',
          email: 'joao@example.com',
          fullName: 'João Silva',
          password: userPassword,
          points: 150,
          organizationId: org1.id,
          isActive: true,
          firstAccess: false,
        },
      }),
      prisma.user.create({
        data: {
          cpf: '98765432100',
          email: 'maria@example.com',
          fullName: 'Maria Santos',
          password: userPassword,
          points: 75,
          organizationId: org1.id,
          isActive: true,
          firstAccess: false,
        },
      }),
      prisma.user.create({
        data: {
          cpf: '11111111111',
          email: 'ana@example.com',
          fullName: 'Ana Oliveira',
          password: userPassword,
          points: 50,
          organizationId: org1.id,
          isActive: true,
          firstAccess: true, // Primeiro acesso
        },
      }),
      prisma.user.create({
        data: {
          cpf: '11122233344',
          email: 'pedro@example.com',
          fullName: 'Pedro Costa',
          password: userPassword,
          points: 200,
          organizationId: org2.id,
          isActive: true,
          firstAccess: false,
        },
      }),
    ]);

    console.log('✅ Usuários criados');

    // Criar histórico de pontos
    console.log('💰 Criando histórico de pontos...');
    await Promise.all([
      prisma.pointsHistory.create({
        data: {
          userId: users[0].id, // João Silva
          pointsAdded: 150,
          sourceDescription: 'Pontos iniciais',
        },
      }),
      prisma.pointsHistory.create({
        data: {
          userId: users[1].id, // Maria Santos
          pointsAdded: 75,
          sourceDescription: 'Pontos iniciais',
        },
      }),
      prisma.pointsHistory.create({
        data: {
          userId: users[2].id, // Ana Oliveira
          pointsAdded: 50,
          sourceDescription: 'Pontos iniciais',
        },
      }),
      prisma.pointsHistory.create({
        data: {
          userId: users[3].id, // Pedro Costa
          pointsAdded: 200,
          sourceDescription: 'Pontos iniciais',
        },
      }),
    ]);

    console.log('✅ Histórico de pontos criado');

    // Criar exemplo de importação de planilha
    console.log('📊 Criando exemplo de importação...');
    const pointsImport = await prisma.pointsImport.create({
      data: {
        fileName: 'pontos-janeiro-2024.xlsx',
        organizationId: org1.id,
        totalRecords: 50,
        successRecords: 48,
        errorRecords: 2,
        status: 'COMPLETED',
        importedBy: admin.id,
        errorDetails: JSON.stringify([
          { row: 15, cpf: '99999999999', error: 'CPF inválido' },
          { row: 32, cpf: '88888888888', error: 'Pontos deve ser um número' },
        ]),
      },
    });

    console.log('✅ Importação de exemplo criada');

    console.log('🎉 Seed do Supabase concluído com sucesso!');
    console.log('');
    console.log('🔑 Credenciais de acesso:');
    console.log('Admin Master:');
    console.log('  CPF: 000.000.000-00');
    console.log('  Senha: admin123');
    console.log('');
    console.log('Organizações criadas:');
    console.log(`  • ${org1.name} - Slug: ${org1.slug}`);
    console.log(`  • ${org2.name} - Slug: ${org2.slug}`);
    console.log('');
    console.log('Clientes de exemplo:');
    console.log('  • João Silva (CPF: 123.456.789-01) - Senha: senha123');
    console.log('  • Maria Santos (CPF: 987.654.321-00) - Senha: senha123');
    console.log('  • Pedro Costa (CPF: 111.222.333-44) - Senha: senha123');
    console.log('  • Ana Oliveira (CPF: 111.111.111-11) - Primeiro acesso');
    console.log('');
    console.log('URLs de teste:');
    console.log(`  • http://localhost:3000/${org1.slug}/login`);
    console.log(`  • http://localhost:3000/${org2.slug}/login`);
    console.log('  • http://localhost:3000/admin/lojistas');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedSupabase();
}

module.exports = { seedSupabase };
