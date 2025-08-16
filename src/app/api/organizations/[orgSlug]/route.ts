import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrganizationService } from '@/lib/services/organization.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ orgSlug: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const organizationService = new OrganizationService();

    // Verificar se o parâmetro é um ID numérico ou um slug
    const isNumericId = /^\d+$/.test(resolvedParams.orgSlug);

    let organization;
    if (isNumericId) {
      // Se for um ID numérico, buscar diretamente
      organization = await organizationService.findById(resolvedParams.orgSlug);
    } else {
      // Se for um slug, buscar pelo slug
      organization = await organizationService.findBySlug(resolvedParams.orgSlug);
    }

    if (!organization || !organization.isActive) {
      return NextResponse.json({ error: 'Organização não encontrada' }, { status: 404 });
    }

    // Retornar apenas informações públicas da organização
    return NextResponse.json({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logoUrl: organization.logoUrl,
      coverHeroUrl: organization.coverHeroUrl,
      isActive: organization.isActive,
    });
  } catch (error) {
    console.error('Erro ao buscar organização:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
