import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Coins, Download, ArrowRight, Users, TrendingUp, Gift } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  country: string;
}

export function Pricing({ country }: Props) {
  return (
    <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Por que escolher a Banca Online?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Uma plataforma completa para sua jornada de leitura digital
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full">
        <Card className="bg-background/70 backdrop-blur-[6px] border-border hover:border-border/60 transition-all duration-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Biblioteca Exclusiva</CardTitle>
            <CardDescription>Acesso a centenas de e-books exclusivos em diversos gêneros e categorias</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border hover:border-border/60 transition-all duration-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Sistema de Pontos</CardTitle>
            <CardDescription>Resgate e-books com pontos acumulados através de atividades e promoções</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border hover:border-border/60 transition-all duration-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Leitura Offline</CardTitle>
            <CardDescription>Baixe seus e-books e leia onde quiser, mesmo sem conexão com a internet</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Seção para Lojistas */}
      <div className="mt-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Programa de Fidelidade
                <br />
                para seu Negócio
              </h3>
              <p className="text-lg text-muted-foreground">
                Transforme suas vendas em pontos e ofereça uma experiência única aos seus clientes. A Banca Online é a
                solução perfeita para lojistas que querem criar um programa de fidelidade diferenciado.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                  <Users className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fidelize seus Clientes</h4>
                  <p className="text-sm text-muted-foreground">
                    Ofereça pontos como recompensa pelas compras e mantenha seus clientes engajados
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Aumente suas Vendas</h4>
                  <p className="text-sm text-muted-foreground">
                    Incentive compras recorrentes com um programa de fidelidade atrativo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                  <Gift className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Diferencial Competitivo</h4>
                  <p className="text-sm text-muted-foreground">
                    Destaque-se da concorrência oferecendo e-books exclusivos como recompensa
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/admin">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/admin">Saiba Mais</Link>
              </Button>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[32px]">
              <Image
                src="/images/mulher-tablet.jpg"
                alt="Lojista utilizando tablet para gerenciar programa de fidelidade"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[32px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Seção FAQ */}
      <div className="mt-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FAQ
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Perguntas frequentes sobre a Banca Online</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="bg-background/70 backdrop-blur-[6px] border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-6">
                Como funciona o sistema de pontos?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                O sistema de pontos permite que você acumule pontos através de compras, promoções e atividades na
                plataforma. Esses pontos podem ser utilizados para resgatar e-books exclusivos em nossa biblioteca
                digital.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-background/70 backdrop-blur-[6px] border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-6">
                Posso ler os e-books offline?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Após resgatar um e-book, você pode fazer o download e ler offline em qualquer dispositivo. Sua
                biblioteca pessoal fica disponível mesmo sem conexão com a internet.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-background/70 backdrop-blur-[6px] border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-6">
                Como posso implementar o programa de fidelidade na minha loja?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                É simples! Entre em contato conosco para configurar sua conta de lojista. Você poderá definir quantos
                pontos seus clientes ganham por compra e acompanhar todas as transações em tempo real.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="bg-background/70 backdrop-blur-[6px] border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-6">
                Quais formatos de e-book são suportados?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Nossa plataforma suporta os principais formatos de e-book: EPUB, PDF e MOBI. Todos os e-books são
                otimizados para leitura em dispositivos móveis e computadores.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="bg-background/70 backdrop-blur-[6px] border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-6">
                Existe algum custo para usar a plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A Banca Online é gratuita para usuários finais. Para lojistas, oferecemos planos flexíveis que se
                adaptam ao tamanho do seu negócio. Entre em contato para conhecer nossas opções.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="bg-background/70 backdrop-blur-[6px] border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-6">
                Como funciona o suporte ao cliente?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Oferecemos suporte completo através de chat online, email e telefone. Nossa equipe está disponível para
                ajudar com qualquer dúvida sobre a plataforma ou implementação do programa de fidelidade.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">Comece sua jornada hoje</h3>
        <p className="text-muted-foreground mb-6">
          Junte-se a milhares de leitores que já descobriram o prazer da leitura digital
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/signup">
            Criar Conta Gratuita
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
