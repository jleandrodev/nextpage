import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Testar conexão básica
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    // Contar registros
    const orgCount = await prisma.organization.count();
    const userCount = await prisma.user.count();
    const ebookCount = await prisma.ebook.count();

    return NextResponse.json({
      success: true,
      message: 'Conexão com banco de dados funcionando',
      data: {
        test: result,
        counts: {
          organizations: orgCount,
          users: userCount,
          ebooks: ebookCount,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
        },
      },
    });
  } catch (error: any) {
    console.error('Erro na conexão com banco:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Erro na conexão com banco de dados',
        error: {
          message: error.message,
          code: error.code,
          meta: error.meta,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
        },
      },
      { status: 500 },
    );
  }
}
