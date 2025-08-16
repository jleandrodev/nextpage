import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function BuiltUsingTools() {
  return (
    <div className="mx-auto max-w-7xl px-8 mt-24 mb-24">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Banca Online</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Sua biblioteca digital de e-books premium. Resgate e-books exclusivos com pontos e construa sua biblioteca
            personalizada.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Plataforma</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/catalogo" className="hover:text-foreground transition-colors">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/biblioteca" className="hover:text-foreground transition-colors">
                Biblioteca
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Sistema de Pontos
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Promoções
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Suporte</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-foreground transition-colors">
                Central de Ajuda
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground transition-colors">
                Como Funciona
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground transition-colors">
                Direitos Autorais
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground transition-colors">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
        <p>&copy; 2024 Banca Online. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
