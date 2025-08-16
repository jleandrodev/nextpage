require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkEbooks() {
  try {
    console.log('🔍 Verificando ebooks no banco de dados...\n');

    // Contar total de ebooks
    const totalEbooks = await prisma.ebook.count();
    console.log(`📊 Total de ebooks no banco: ${totalEbooks}`);

    if (totalEbooks === 0) {
      console.log('❌ Nenhum ebook encontrado no banco de dados');
      return;
    }

    // Listar os últimos 10 ebooks
    const ebooks = await prisma.ebook.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        author: true,
        category: true,
        pointsCost: true,
        coverImageUrl: true,
        ebookFileUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    console.log('\n📚 Últimos ebooks criados:');
    ebooks.forEach((ebook, index) => {
      console.log(`\n${index + 1}. ${ebook.title}`);
      console.log(`   ID: ${ebook.id}`);
      console.log(`   Autor: ${ebook.author}`);
      console.log(`   Categoria: ${ebook.category}`);
      console.log(`   Pontos: ${ebook.pointsCost}`);
      console.log(`   Ativo: ${ebook.isActive ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${ebook.createdAt.toLocaleString('pt-BR')}`);
      
      if (ebook.coverImageUrl) {
        console.log(`   ✅ Capa: ${ebook.coverImageUrl}`);
      } else {
        console.log(`   ❌ Capa: Não configurada`);
      }
      
      if (ebook.ebookFileUrl) {
        console.log(`   ✅ Arquivo: ${ebook.ebookFileUrl}`);
      } else {
        console.log(`   ❌ Arquivo: Não configurado`);
      }
    });

    // Verificar ebooks sem URLs
    const ebooksWithoutUrls = await prisma.ebook.findMany({
      where: {
        OR: [
          { coverImageUrl: '' },
          { coverImageUrl: null },
          { ebookFileUrl: '' },
          { ebookFileUrl: null },
        ],
      },
      select: {
        id: true,
        title: true,
        coverImageUrl: true,
        ebookFileUrl: true,
      },
    });

    if (ebooksWithoutUrls.length > 0) {
      console.log(`\n⚠️  ${ebooksWithoutUrls.length} ebooks sem URLs configuradas:`);
      ebooksWithoutUrls.forEach((ebook) => {
        console.log(`   - ${ebook.title} (ID: ${ebook.id})`);
        console.log(`     Capa: ${ebook.coverImageUrl || 'Não configurada'}`);
        console.log(`     Arquivo: ${ebook.ebookFileUrl || 'Não configurado'}`);
      });
    } else {
      console.log('\n✅ Todos os ebooks têm URLs configuradas!');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar ebooks:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await checkEbooks();
}

main().catch(console.error);
