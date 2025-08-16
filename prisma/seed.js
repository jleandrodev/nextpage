const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.pointsHistory.deleteMany();
  await prisma.redemption.deleteMany();
  await prisma.pointsImport.deleteMany();
  await prisma.ebook.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log('🗑️  Dados anteriores removidos');

  // Criar admin master
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

  console.log('👤 Admin master criado');

  // Criar organizações de exemplo
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

  console.log('🏢 Organizações criadas');

  // Criar ebooks de exemplo
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

  console.log('📚 Ebooks criados');

  // Criar usuários clientes de exemplo
  const clientPassword = await bcrypt.hash('senha123', 12);

  const user1 = await prisma.user.create({
    data: {
      cpf: '12345678901',
      email: 'joao@email.com',
      fullName: 'João Silva',
      password: clientPassword,
      role: 'CLIENTE',
      points: 150,
      organizationId: org1.id,
      firstAccess: false,
      isActive: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      cpf: '98765432100',
      email: 'maria@email.com',
      fullName: 'Maria Santos',
      password: clientPassword,
      role: 'CLIENTE',
      points: 75,
      organizationId: org1.id,
      firstAccess: false,
      isActive: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      cpf: '11122233344',
      email: 'pedro@email.com',
      fullName: 'Pedro Costa',
      password: clientPassword,
      role: 'CLIENTE',
      points: 200,
      organizationId: org2.id,
      firstAccess: false,
      isActive: true,
    },
  });

  // Usuário para primeiro acesso
  const user4 = await prisma.user.create({
    data: {
      cpf: '11111111111',
      email: 'ana@email.com',
      fullName: 'Ana Oliveira',
      password: await bcrypt.hash('temp123', 12), // Senha temporária
      role: 'CLIENTE',
      points: 50,
      organizationId: org1.id,
      firstAccess: true,
      isActive: true,
    },
  });

  console.log('👥 Usuários criados');

  // Criar histórico de pontos
  await Promise.all([
    prisma.pointsHistory.create({
      data: {
        userId: user1.id,
        pointsAdded: 100,
        sourceDescription: 'Compra inicial - Janeiro 2024',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: user1.id,
        pointsAdded: 50,
        sourceDescription: 'Compra adicional - Fevereiro 2024',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: user2.id,
        pointsAdded: 75,
        sourceDescription: 'Compra - Janeiro 2024',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: user3.id,
        pointsAdded: 200,
        sourceDescription: 'Compra VIP - Janeiro 2024',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: user4.id,
        pointsAdded: 50,
        sourceDescription: 'Cadastro novo cliente',
      },
    }),
  ]);

  console.log('💰 Histórico de pontos criado');

  // Criar alguns resgates de exemplo
  await Promise.all([
    prisma.redemption.create({
      data: {
        userId: user1.id,
        ebookId: ebooks[0].id, // O Poder do Hábito
        organizationId: org1.id,
        pointsUsed: 1,
      },
    }),
    prisma.redemption.create({
      data: {
        userId: user2.id,
        ebookId: ebooks[1].id, // Pai Rico, Pai Pobre
        organizationId: org1.id,
        pointsUsed: 1,
      },
    }),
    prisma.redemption.create({
      data: {
        userId: user3.id,
        ebookId: ebooks[3].id, // Mindset
        organizationId: org2.id,
        pointsUsed: 1,
      },
    }),
  ]);

  console.log('🏆 Resgates criados');

  // Criar exemplo de importação de planilha
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

  console.log('📊 Importação de exemplo criada');

  console.log('✅ Seed concluído com sucesso!');
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
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
