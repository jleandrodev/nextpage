import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/lib/services/user.service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userService = new UserService();
    const user = await userService.findByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Retornar informações do usuário
    return NextResponse.json({
      id: user.id,
      name: user.fullName,
      email: user.email,
      points: user.points || 0,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
            logoUrl: user.organization.logoUrl,
            coverHeroUrl: user.organization.coverHeroUrl,
          }
        : null,
    });
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
