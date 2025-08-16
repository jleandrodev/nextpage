import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserService } from '@/lib/services/user.service';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        cpf: { label: 'CPF', type: 'text' },
        password: { label: 'Senha', type: 'password' },
        organizationSlug: { label: 'Organização', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.cpf || !credentials?.password) {
          return null;
        }

        try {
          const userService = new UserService();

          // Limpar CPF (remover formatação)
          const cleanCpf = credentials.cpf.replace(/\D/g, '');
          console.log('🔍 Tentativa de login - CPF:', cleanCpf, 'OrganizationSlug:', credentials.organizationSlug);

          // Buscar usuário
          const user = await userService.findByCpf(cleanCpf);
          console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não', 'Role:', user?.role);

          if (!user || !user.isActive) {
            console.log('❌ Usuário não encontrado ou inativo');
            return null;
          }

          console.log('🔐 Verificando senha para usuário:', user.id);

          // Verificar senha
          const isPasswordValid = await userService.verifyPassword(user.id, credentials.password);
          console.log('🔑 Senha válida:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('❌ Senha inválida');
            return null;
          }

          // Se for cliente, verificar se pertence à organização correta
          if (user.role === 'CLIENTE') {
            if (!credentials.organizationSlug) {
              console.log('❌ Cliente precisa de organizationSlug');
              return null;
            }
            if (!user.organization || user.organization.slug !== credentials.organizationSlug) {
              console.log('❌ Cliente não pertence à organização correta');
              return null;
            }
            console.log('✅ Cliente autenticado na organização correta');
          }

          // Se for admin, não precisa verificar organização
          if (user.role === 'ADMIN_MASTER') {
            console.log('👑 Login de admin master bem-sucedido');
          }

          return {
            id: user.id,
            cpf: user.cpf,
            email: user.email,
            name: user.fullName,
            role: user.role,
            organizationId: user.organizationId,
            organization: user.organization
              ? {
                  id: user.organization.id,
                  name: user.organization.name,
                  slug: user.organization.slug,
                  logoUrl: user.organization.logoUrl,
                }
              : null,
            firstAccess: user.firstAccess,
            points: user.points,
          };
        } catch (error) {
          console.error('Erro na autenticação:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.cpf = user.cpf;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.organization = user.organization;
        token.firstAccess = user.firstAccess;
        token.points = user.points;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.cpf = token.cpf as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
        session.user.organization = token.organization as any;
        session.user.firstAccess = token.firstAccess as boolean;
        session.user.points = token.points as number;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // Redirecionar para a página inicial
    error: '/', // Redirecionar para a página inicial em caso de erro
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      cpf: string;
      email?: string;
      name?: string;
      role: string;
      organizationId?: string;
      organization?: {
        id: string;
        name: string;
        slug: string;
        logoUrl?: string;
      };
      firstAccess: boolean;
      points: number;
    };
  }

  interface User {
    id: string;
    cpf: string;
    email?: string;
    name?: string;
    role: string;
    organizationId?: string;
    organization?: {
      id: string;
      name: string;
      slug: string;
      logoUrl?: string;
    };
    firstAccess: boolean;
    points: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    cpf: string;
    role: string;
    organizationId?: string;
    organization?: {
      id: string;
      name: string;
      slug: string;
      logoUrl?: string;
    };
    firstAccess: boolean;
    points: number;
  }
}
