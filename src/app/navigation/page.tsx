import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HomePageBackground } from '@/components/gradients/home-page-background';
import { BookOpen, User, Settings, Upload, BarChart3, Library, Coins } from 'lucide-react';
import Link from 'next/link';

export default function NavigationPage() {
  const areas = [
    {
      title: 'Área do Cliente',
      description: 'Dashboard, catálogo e biblioteca de e-books',
      icon: User,
      color: 'bg-primary',
      pages: [
        { name: 'Dashboard', href: '/dashboard', icon: Coins, description: 'Saldo de pontos e histórico' },
        { name: 'Catálogo', href: '/catalogo', icon: BookOpen, description: 'Resgatar e-books' },
        { name: 'Minha Biblioteca', href: '/biblioteca', icon: Library, description: 'E-books resgatados' },
      ],
    },
    {
      title: 'Área do Admin',
      description: 'Gerenciamento de e-books e distribuição de pontos',
      icon: Settings,
      color: 'bg-destructive',
      pages: [
        { name: 'Gerenciar E-books', href: '/admin/ebooks', icon: BookOpen, description: 'Cadastrar e editar e-books' },
        { name: 'Gerenciar Pontos', href: '/admin/pontos', icon: Upload, description: 'Upload de planilhas de pontos' },
        {
          name: 'Relatórios',
          href: '/admin/relatorios/resgates',
          icon: BarChart3,
          description: 'Relatório de resgates',
        },
      ],
    },
    {
      title: 'Autenticação',
      description: 'Login e primeiro acesso',
      icon: User,
      color: 'bg-secondary',
      pages: [
        { name: 'Login', href: '/login', icon: User, description: 'Fazer login no sistema' },
        { name: 'Primeiro Acesso', href: '/primeiro-acesso', icon: User, description: 'Criar senha inicial' },
      ],
    },
  ];

  return (
    <div className="min-h-screen relative">
      <HomePageBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Banca Online - Navegação</h1>
          <p className="text-lg text-muted-foreground">Plataforma de fidelidade com resgate de e-books</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <Card key={area.title} className="bg-background/70 backdrop-blur-[6px] border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${area.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{area.title}</CardTitle>
                      <CardDescription>{area.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {area.pages.map((page) => {
                    const PageIcon = page.icon;
                    return (
                      <Link key={page.name} href={page.href}>
                        <Button variant="outline" className="w-full justify-start h-auto p-3">
                          <div className="flex items-start gap-3">
                            <PageIcon className="h-5 w-5 mt-0.5" />
                            <div className="text-left">
                              <div className="font-medium">{page.name}</div>
                              <div className="text-xs text-muted-foreground">{page.description}</div>
                            </div>
                          </div>
                        </Button>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-background/70 backdrop-blur-[6px] border-border max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
              <CardDescription>Este é um protótipo para validação de layout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Funcionalidades Implementadas</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Layout responsivo com gradientes</li>
                    <li>• Sistema de navegação</li>
                    <li>• Cards e tabelas com dados mockados</li>
                    <li>• Filtros e busca</li>
                    <li>• Diálogos de confirmação</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Próximos Passos</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Integração com Supabase</li>
                    <li>• Autenticação real</li>
                    <li>• Upload de arquivos</li>
                    <li>• Processamento de planilhas</li>
                    <li>• Download de e-books</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
