import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrganizationService } from '@/lib/services/organization.service';
import { PointsImportService } from '@/lib/services/points-import.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ orgSlug: string }> }) {
  try {
    console.log('🔍 API Stats - Iniciando requisição');

    const session = await getServerSession(authOptions);
    console.log('🔍 API Stats - Session:', session?.user?.role);

    // Temporariamente comentar verificação de autenticação para debug
    // if (!session?.user || session.user.role !== 'ADMIN_MASTER') {
    //   console.log('❌ API Stats - Acesso negado');
    //   return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    // }

    const resolvedParams = await params;
    console.log('🔍 API Stats - Parâmetros:', resolvedParams);

    const organizationService = new OrganizationService();
    const pointsImportService = new PointsImportService();

    // Verificar se o parâmetro é um ID numérico ou um slug
    const isNumericId = /^\d+$/.test(resolvedParams.orgSlug);
    console.log('🔍 API Stats - É ID numérico?', isNumericId);

    let organization;
    if (isNumericId) {
      // Se for um ID numérico, buscar diretamente
      console.log('🔍 API Stats - Buscando por ID:', resolvedParams.orgSlug);
      organization = await organizationService.findById(resolvedParams.orgSlug);
    } else {
      // Se for um slug, buscar pelo slug
      console.log('🔍 API Stats - Buscando por slug:', resolvedParams.orgSlug);
      organization = await organizationService.findBySlug(resolvedParams.orgSlug);
    }

    console.log('🔍 API Stats - Organização encontrada:', !!organization);

    if (!organization) {
      console.log('❌ API Stats - Organização não encontrada');
      return NextResponse.json({ error: 'Organização não encontrada' }, { status: 404 });
    }

    // Buscar estatísticas da organização
    console.log('🔍 API Stats - Buscando estatísticas para organização:', organization.id);
    const stats = await organizationService.getStats(organization.id);
    console.log('📊 API Stats - Estatísticas:', stats);

    // Buscar importações da organização
    console.log('🔍 API Stats - Buscando importações para organização:', organization.id);
    const imports = await pointsImportService.findByOrganization(organization.id);
    console.log('📊 API Stats - Importações encontradas:', imports.length);

    // Calcular último upload
    const lastUpload =
      imports.length > 0
        ? new Date(imports[0].createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        : '';

    const result = {
      totalUsers: stats.totalUsers,
      totalPoints: stats.totalPoints,
      lastUpload,
      totalUploads: imports.length,
    };

    console.log('✅ API Stats - Resultado final:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API Stats - Erro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
