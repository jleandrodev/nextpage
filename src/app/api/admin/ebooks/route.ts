import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN_MASTER') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';

    // Calcular offset para paginação
    const offset = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    // Filtro por busca (título ou autor)
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          author: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          category: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Buscar ebooks com contagem de resgates
    const [ebooks, total] = await Promise.all([
      prisma.ebook.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: {
              redemptions: true,
            },
          },
        },
      }),
      prisma.ebook.count({ where }),
    ]);

    // Buscar estatísticas
    const stats = await prisma.$transaction([
      prisma.ebook.count(),
      prisma.redemption.count(),
      prisma.ebook.findFirst({
        orderBy: {
          redemptions: {
            _count: 'desc',
          },
        },
        include: {
          _count: {
            select: {
              redemptions: true,
            },
          },
        },
      }),
      prisma.ebook.aggregate({
        _avg: {
          pointsCost: true,
        },
      }),
    ]);

    return NextResponse.json({
      ebooks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalEbooks: stats[0],
        totalRedemptions: stats[1],
        mostPopularEbook: stats[2],
        averagePoints: Math.round(stats[3]._avg.pointsCost || 0),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar ebooks:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
