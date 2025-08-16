import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { BookOpen, LogIn, UserPlus, Library } from 'lucide-react';

interface Props {
  user: User | null;
}

export default function Header({ user }: Props) {
  // Para desenvolvimento local, mostra um usuário mockado
  const mockUser = process.env.NODE_ENV === 'development' && !user ? { id: 'mock-user-id' } : user;

  return (
    <nav className="relative z-10">
      <div className="mx-auto max-w-7xl relative px-[32px] py-[18px] flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href={'/'}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Banca Online</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex space-x-4">
            {mockUser?.id ? (
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <Library className="mr-2 h-4 w-4" />
                  Minha Biblioteca
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar Conta
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
