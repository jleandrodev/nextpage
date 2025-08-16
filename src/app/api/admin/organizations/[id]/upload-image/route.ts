import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrganizationService } from '@/lib/services/organization.service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const organizationId = resolvedParams.id;

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    console.log('👤 Sessão:', session?.user ? 'Usuário logado' : 'Não logado');

    if (!session?.user) {
      console.log('❌ Usuário não autorizado');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    console.log('🔑 Role do usuário:', session.user.role);

    // Verificar se o usuário é admin master
    if (session.user.role !== 'ADMIN_MASTER') {
      console.log('❌ Acesso negado - não é admin master');
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const imageType = formData.get('imageType') as string;

    console.log('🚀 Upload iniciado para organização:', organizationId);
    console.log('📁 Tipo de imagem:', imageType);
    console.log('📄 Arquivo:', file?.name, file?.size, 'bytes');

    if (!file) {
      console.error('❌ Nenhum arquivo fornecido');
      return NextResponse.json({ success: false, error: 'Nenhum arquivo fornecido' }, { status: 400 });
    }

    if (!imageType || !['logo', 'loginImage', 'coverHero'].includes(imageType)) {
      console.error('❌ Tipo de imagem inválido:', imageType);
      return NextResponse.json({ success: false, error: 'Tipo de imagem inválido' }, { status: 400 });
    }

    // Validar organização
    const organizationService = new OrganizationService();
    const organization = await organizationService.findById(organizationId);

    if (!organization) {
      console.error('❌ Organização não encontrada:', organizationId);
      return NextResponse.json({ success: false, error: 'Organização não encontrada' }, { status: 404 });
    }

    console.log('✅ Organização encontrada:', organization.name);

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (imageType === 'logo') {
      allowedTypes.push('image/svg+xml');
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Tipo de arquivo não suportado' }, { status: 400 });
    }

    // Validar tamanho (15MB para login e cover, 2MB para logo)
    const maxSize = imageType === 'logo' ? 2 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          success: false,
          error: `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`,
        },
        { status: 400 },
      );
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${organizationId}-${imageType}-${uuidv4()}.${fileExtension}`;

    // Determinar bucket baseado no tipo de imagem
    let bucketName: string;
    switch (imageType) {
      case 'logo':
        bucketName = 'logos';
        break;
      case 'loginImage':
        bucketName = 'login-images';
        break;
      case 'coverHero':
        bucketName = 'cover-hero';
        break;
      default:
        return NextResponse.json({ success: false, error: 'Tipo de imagem inválido' }, { status: 400 });
    }

    // Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Fazer upload para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      console.error('Erro no upload para Supabase:', uploadError);
      return NextResponse.json({ success: false, error: 'Erro ao fazer upload da imagem' }, { status: 500 });
    }

    // Gerar URL pública
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // Atualizar organização no banco de dados
    const updateData: any = {};
    switch (imageType) {
      case 'logo':
        updateData.logoUrl = imageUrl;
        break;
      case 'loginImage':
        updateData.loginImageUrl = imageUrl;
        break;
      case 'coverHero':
        updateData.coverHeroUrl = imageUrl;
        break;
    }

    console.log('🔄 Atualizando organização:', organizationId);
    console.log('📝 Dados para atualização:', updateData);
    console.log('🔗 URL da imagem:', imageUrl);

    const updatedOrganization = await organizationService.update({
      id: organizationId,
      ...updateData,
    });

    console.log('✅ Organização atualizada:', updatedOrganization?.id);
    console.log(
      '🖼️ URL salva:',
      updatedOrganization?.[
        `${imageType === 'loginImage' ? 'loginImageUrl' : imageType === 'coverHero' ? 'coverHeroUrl' : 'logoUrl'}`
      ],
    );

    if (!updatedOrganization) {
      console.error('❌ Falha ao atualizar organização');
      return NextResponse.json({ success: false, error: 'Erro ao atualizar organização' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        imageUrl,
        organization: updatedOrganization,
      },
    });
  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}
