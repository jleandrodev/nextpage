import { NextRequest, NextResponse } from 'next/server';
import { OrganizationService } from '@/lib/services/organization.service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const organizationId = resolvedParams.id;
    const body = await request.json();
    const { imageType } = body;

    if (!imageType || !['logo', 'loginImage', 'coverHero'].includes(imageType)) {
      return NextResponse.json({ success: false, error: 'Tipo de imagem inválido' }, { status: 400 });
    }

    // Validar organização
    const organizationService = new OrganizationService();
    const organization = await organizationService.findById(organizationId);

    if (!organization) {
      return NextResponse.json({ success: false, error: 'Organização não encontrada' }, { status: 404 });
    }

    // Determinar bucket e URL atual
    let bucketName: string;
    let currentImageUrl: string | null = null;

    switch (imageType) {
      case 'logo':
        bucketName = 'logos';
        currentImageUrl = organization.logoUrl;
        break;
      case 'loginImage':
        bucketName = 'login-images';
        currentImageUrl = organization.loginImageUrl;
        break;
      case 'coverHero':
        bucketName = 'cover-hero';
        currentImageUrl = organization.coverHeroUrl;
        break;
      default:
        return NextResponse.json({ success: false, error: 'Tipo de imagem inválido' }, { status: 400 });
    }

    // Se não há imagem para remover, retornar sucesso
    if (!currentImageUrl) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma imagem para remover',
      });
    }

    // Extrair nome do arquivo da URL
    const urlParts = currentImageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Remover arquivo do Supabase Storage
    const { error: deleteError } = await supabase.storage.from(bucketName).remove([fileName]);

    if (deleteError) {
      console.error('Erro ao remover arquivo do Supabase:', deleteError);
      // Não falhar se o arquivo não existir no storage
      if (deleteError.message !== 'The resource was not found') {
        return NextResponse.json({ success: false, error: 'Erro ao remover arquivo do storage' }, { status: 500 });
      }
    }

    // Atualizar organização no banco de dados
    const updateData: any = {};
    switch (imageType) {
      case 'logo':
        updateData.logoUrl = null;
        break;
      case 'loginImage':
        updateData.loginImageUrl = null;
        break;
      case 'coverHero':
        updateData.coverHeroUrl = null;
        break;
    }

    const updatedOrganization = await organizationService.update(organizationId, updateData);

    if (!updatedOrganization) {
      return NextResponse.json({ success: false, error: 'Erro ao atualizar organização' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        organization: updatedOrganization,
      },
      message: 'Imagem removida com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}
