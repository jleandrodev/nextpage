import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrganizationService } from '@/lib/services/organization.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    console.log('🔍 Buscando organização:', resolvedParams.id);

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

    const organizationService = new OrganizationService();
    const organization = await organizationService.findById(resolvedParams.id);

    console.log('📋 Organização encontrada:', organization ? 'Sim' : 'Não');

    if (!organization) {
      console.log('❌ Organização não encontrada no banco');
      return NextResponse.json({ error: 'Organização não encontrada' }, { status: 404 });
    }

    console.log('✅ Retornando organização:', organization.name);
    // Retornar todas as informações da organização para o admin
    return NextResponse.json(organization);
  } catch (error) {
    console.error('❌ Erro ao buscar organização:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
