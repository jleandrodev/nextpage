import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Rotas do admin - apenas ADMIN_MASTER (exceto login)
    if (pathname.startsWith('/admin') && !pathname.includes('/login') && token?.role !== 'ADMIN_MASTER') {
      console.log('🚫 Acesso negado ao admin - role:', token?.role);
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Rotas de organização - verificar se usuário pertence à organização
    if (pathname.startsWith('/') && pathname.includes('/dashboard')) {
      const orgSlug = pathname.split('/')[1]; // Pegar o slug da organização da URL

      if (token?.role === 'CLIENTE') {
        // Cliente deve pertencer à organização da URL
        if (!token.organization || token.organization.slug !== orgSlug) {
          return NextResponse.redirect(new URL(`/${orgSlug}/login`, req.url));
        }
      }
    }

    // Rotas de catálogo - verificar se usuário pertence à organização
    if (pathname.startsWith('/') && pathname.includes('/catalogo')) {
      const orgSlug = pathname.split('/')[1]; // Pegar o slug da organização da URL

      if (token?.role === 'CLIENTE') {
        // Cliente deve pertencer à organização da URL
        if (!token.organization || token.organization.slug !== orgSlug) {
          return NextResponse.redirect(new URL(`/${orgSlug}/login`, req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Rotas públicas que não precisam de autenticação
        const publicPaths = ['/', '/api/auth', '/favicon.ico'];
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        // Permitir rotas de login
        if (pathname.includes('/login') || pathname.includes('/primeiro-acesso')) {
          return true;
        }

        // Todas as outras rotas precisam de autenticação
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
