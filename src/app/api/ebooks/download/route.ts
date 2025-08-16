import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/lib/services/user.service';

const userService = new UserService();

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { ebookId, organizationId, pointsCost = 1 } = await request.json();

    if (!ebookId || !organizationId) {
      return NextResponse.json({ error: 'ebookId e organizationId são obrigatórios' }, { status: 400 });
    }

    // Usar a nova função de download que permite múltiplos downloads
    const result = await userService.downloadEbook(session.user.id, ebookId, organizationId, pointsCost);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao processar download:', error);

    if (error instanceof Error) {
      if (error.message === 'Pontos insuficientes') {
        return NextResponse.json({ error: 'Pontos insuficientes para realizar o download' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
