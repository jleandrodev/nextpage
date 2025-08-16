'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUserInfo } from '@/hooks/useUserInfo';
import '@/styles/home-page.css';
import { LocalizationBanner } from '@/components/home/header/localization-banner';
import Header from '@/components/home/header/header';
import { HeroSection } from '@/components/home/hero-section/hero-section';
import { Pricing } from '@/components/home/pricing/pricing';
import { HomePageBackground } from '@/components/gradients/home-page-background';
import { Footer } from '@/components/home/footer/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, Download, Star } from 'lucide-react';

// Componente de estatísticas
function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-[32px] py-16">
      <div className="grid md:grid-cols-4 gap-8">
        <Card className="bg-background/70 backdrop-blur-[6px] border-border text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-muted-foreground mb-2" />
              <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
              <div className="text-muted-foreground">Usuários Ativos</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-muted-foreground">E-books Disponíveis</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Download className="h-8 w-8 text-muted-foreground mb-2" />
              <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div className="text-muted-foreground">Downloads Realizados</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-muted-foreground mb-2" />
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9</div>
              <div className="text-muted-foreground">Avaliação Média</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function HomePage() {
  const supabase = createClient();
  const { user } = useUserInfo(supabase);
  const [country, setCountry] = useState('US');

  return (
    <>
      <div>
        <HomePageBackground />
        <Header user={user} />
        <HeroSection />
        <StatsSection />
        <Pricing country={country} />
        <Footer />
      </div>
    </>
  );
}
