import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Se não estiver logado, redirecionar para login
  if (!session?.user) {
    redirect('/admin/login');
  }

  // Se não for admin, redirecionar para página inicial
  if (session.user.role !== 'ADMIN_MASTER') {
    redirect('/');
  }

  // Se for admin, redirecionar para o dashboard
  redirect('/admin/lojistas');
}
