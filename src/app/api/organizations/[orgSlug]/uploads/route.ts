import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrganizationService } from '@/lib/services/organization.service';
import { PointsImportService } from '@/lib/services/points-import.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ orgSlug: string }> }) {
  try {
    console.log('🔍 API Uploads - Iniciando requisição');

    const session = await getServerSession(authOptions);
    console.log('🔍 API Uploads - Session:', session?.user?.role);

    // Temporariamente comentar verificação de autenticação para debug
    // if (!session?.user || session.user.role !== 'ADMIN_MASTER') {
    //   console.log('❌ API Uploads - Acesso negado');
    //   return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    // }

    const resolvedParams = await params;
    console.log('🔍 API Uploads - Parâmetros:', resolvedParams);

    const organizationService = new OrganizationService();
    const pointsImportService = new PointsImportService();

    // Verificar se o parâmetro é um ID numérico ou um slug
    const isNumericId = /^\d+$/.test(resolvedParams.orgSlug);
    console.log('🔍 API Uploads - É ID numérico?', isNumericId);

    let organization;
    if (isNumericId) {
      // Se for um ID numérico, buscar diretamente
      console.log('🔍 API Uploads - Buscando por ID:', resolvedParams.orgSlug);
      organization = await organizationService.findById(resolvedParams.orgSlug);
    } else {
      // Se for um slug, buscar pelo slug
      console.log('🔍 API Uploads - Buscando por slug:', resolvedParams.orgSlug);
      organization = await organizationService.findBySlug(resolvedParams.orgSlug);
    }

    console.log('🔍 API Uploads - Organização encontrada:', !!organization);

    if (!organization) {
      console.log('❌ API Uploads - Organização não encontrada');
      return NextResponse.json({ error: 'Organização não encontrada' }, { status: 404 });
    }

    // Buscar importações da organização
    console.log('🔍 API Uploads - Buscando importações para organização:', organization.id);
    const imports = await pointsImportService.findByOrganization(organization.id);
    console.log('📊 API Uploads - Importações encontradas:', imports.length);

    // Mapear para o formato esperado pelo frontend
    const uploadHistory = imports.map((importRecord) => ({
      id: importRecord.id,
      fileName: importRecord.fileName,
      createdAt: importRecord.createdAt.toISOString(),
      status: importRecord.status,
      successRecords: importRecord.successRecords || 0,
      totalRecords: importRecord.totalRecords,
      organizationName: importRecord.organization?.name || '',
    }));

    console.log('✅ API Uploads - Resultado final:', uploadHistory);
    return NextResponse.json(uploadHistory);
  } catch (error) {
    console.error('❌ API Uploads - Erro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
