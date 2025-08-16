import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 50) + '...',
      databaseUrlHasSSL: process.env.DATABASE_URL?.includes('sslmode=require'),
    },
    tests: {} as any,
  };

  try {
    // Teste 1: Criar nova instância do Prisma
    console.log('🔍 Teste 1: Criando nova instância do Prisma...');
    const testPrisma = new PrismaClient({
      log: ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Teste 2: Conexão básica
    console.log('🔍 Teste 2: Testando conexão básica...');
    const basicTest = await testPrisma.$queryRaw`SELECT 1 as test`;
    diagnostics.tests.basicConnection = {
      success: true,
      result: basicTest,
    };

    // Teste 3: Contagem de tabelas
    console.log('🔍 Teste 3: Testando contagem de tabelas...');
    const orgCount = await testPrisma.organization.count();
    diagnostics.tests.organizationCount = {
      success: true,
      count: orgCount,
    };

    // Teste 4: Query simples
    console.log('🔍 Teste 4: Testando query simples...');
    const orgs = await testPrisma.organization.findMany({
      take: 1,
      select: { id: true, name: true },
    });
    diagnostics.tests.simpleQuery = {
      success: true,
      result: orgs,
    };

    await testPrisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Todos os testes passaram!',
      diagnostics,
    });
  } catch (error: any) {
    console.error('❌ Erro nos testes:', error);

    diagnostics.tests.error = {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack?.split('\n').slice(0, 3),
    };

    return NextResponse.json(
      {
        success: false,
        message: 'Erro nos testes de conexão',
        diagnostics,
      },
      { status: 500 },
    );
  }
}
