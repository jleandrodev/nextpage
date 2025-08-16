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

    const { ebookId, organizationId } = await request.json();

    if (!ebookId || !organizationId) {
      return NextResponse.json({ error: 'ebookId e organizationId são obrigatórios' }, { status: 400 });
    }

    // Resgatar ebook
    const redemption = await userService.redeemEbook(session.user.id, ebookId, organizationId);

    return NextResponse.json({
      success: true,
      redemption,
      message: 'Ebook resgatado com sucesso!',
    });
  } catch (error: any) {
    console.error('Erro ao resgatar ebook:', error);

    if (error.message === 'Pontos insuficientes') {
      return NextResponse.json({ error: 'Pontos insuficientes para resgatar este ebook' }, { status: 400 });
    }

    if (error.message === 'Ebook já foi resgatado por este usuário') {
      return NextResponse.json({ error: 'Você já resgatou este ebook anteriormente' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
