const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkOrganizations() {
  try {
    console.log('🔍 Verificando organizações no banco de dados...');

    // Verificar se existem organizações
    const organizations = await prisma.organization.findMany({
      include: {
        users: true,
      },
    });

    console.log(`📊 Total de organizações encontradas: ${organizations.length}`);

    if (organizations.length === 0) {
      console.log('⚠️  Nenhuma organização encontrada. Criando organização de teste...');

      // Criar organização de teste
      const testOrganization = await prisma.organization.create({
        data: {
          name: 'Clube Stilo A',
          cnpj: '12.345.678/0001-90',
          slug: 'stilo-a',
          logoUrl: null,
          loginImageUrl: null,
          coverHeroUrl: null,
          isActive: true,
        },
      });

      console.log('✅ Organização de teste criada:', testOrganization);

      // Criar usuário admin master
      const adminUser = await prisma.user.create({
        data: {
          cpf: '12345678901',
          email: 'admin@stilo-a.com',
          fullName: 'Administrador Stilo A',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqQKqK', // senha: 123456
          role: 'ADMIN_MASTER',
          organizationId: testOrganization.id,
          isActive: true,
        },
      });

      console.log('✅ Usuário admin criado:', adminUser);

      // Criar usuário cliente de teste
      const clientUser = await prisma.user.create({
        data: {
          cpf: '98765432100',
          email: 'cliente@stilo-a.com',
          fullName: 'Cliente Teste',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqQKqK', // senha: 123456
          role: 'CLIENTE',
          organizationId: testOrganization.id,
          points: 100,
          isActive: true,
        },
      });

      console.log('✅ Usuário cliente criado:', clientUser);

      // Criar alguns ebooks de teste
      const ebooks = await Promise.all([
        prisma.ebook.create({
          data: {
            title: 'A Startup Enxuta',
            author: 'Eric Ries',
            description: 'Como os empreendedores utilizam a inovação contínua para criar empresas extremamente bem-sucedidas',
            category: 'Negócios',
            coverImageUrl: '/images/autoajuda.jpg',
            ebookFileUrl: '/ebooks/startup-enxuta.pdf',
            pointsCost: 50,
            organizationId: testOrganization.id,
            isActive: true,
          },
        }),
        prisma.ebook.create({
          data: {
            title: 'O Monge e o Executivo',
            author: 'James C. Hunter',
            description: 'Uma história sobre a essência da liderança',
            category: 'Liderança',
            coverImageUrl: '/images/desenvolvimentopessoal.jpg',
            ebookFileUrl: '/ebooks/monge-executivo.pdf',
            pointsCost: 30,
            organizationId: testOrganization.id,
            isActive: true,
          },
        }),
        prisma.ebook.create({
          data: {
            title: 'Pense e Enriqueça',
            author: 'Napoleon Hill',
            description: 'Os segredos do sucesso baseados na filosofia de Andrew Carnegie',
            category: 'Motivação',
            coverImageUrl: '/images/financas.jpg',
            ebookFileUrl: '/ebooks/pense-enriqueça.pdf',
            pointsCost: 40,
            organizationId: testOrganization.id,
            isActive: true,
          },
        }),
      ]);

      console.log('✅ Ebooks de teste criados:', ebooks.length);

    } else {
      console.log('📋 Organizações existentes:');
      organizations.forEach((org, index) => {
        console.log(`${index + 1}. ${org.name} (${org.slug}) - ${org.users.length} usuários`);
      });
    }

    console.log('\n🎯 URLs de teste:');
    console.log('- Login: http://localhost:3000/stilo-a/login');
    console.log('- Dashboard: http://localhost:3000/stilo-a/dashboard');
    console.log('- Catálogo: http://localhost:3000/stilo-a/catalogo');
    console.log('\n👤 Credenciais de teste:');
    console.log('- Admin: CPF 12345678901 / Senha 123456');
    console.log('- Cliente: CPF 98765432100 / Senha 123456');

  } catch (error) {
    console.error('❌ Erro ao verificar organizações:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrganizations();
