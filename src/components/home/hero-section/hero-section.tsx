import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-[32px] relative flex items-center justify-between mt-16 mb-12">
      <div className="text-center w-full">
        <h1 className="text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Sua biblioteca digital
          <br />
          de e-books premium.
        </h1>
        <p className="mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px] text-muted-foreground">
          Resgate e-books exclusivos com pontos e construa sua biblioteca digital personalizada.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/signup">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/catalogo">
              <BookOpen className="mr-2 h-4 w-4" />
              Ver Catálogo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
