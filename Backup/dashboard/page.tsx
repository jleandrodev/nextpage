import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Calendar, BookOpen, Download, Star, Gift } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Dados mockados
  const saldoPontos = 1250;
  const ebooksResgatados = 8;
  const ultimaAtividade = '2024-01-15';

  const historicoPontos = [
    { data: '2024-01-15', pontos: 500, descricao: 'Compra na loja - R$ 100', tipo: 'recebido' },
    { data: '2024-01-10', pontos: 300, descricao: 'Promoção especial', tipo: 'recebido' },
    { data: '2024-01-05', pontos: 450, descricao: 'Compra na loja - R$ 90', tipo: 'recebido' },
    { data: '2024-01-03', pontos: -80, descricao: 'Resgate: 1984', tipo: 'gasto' },
    { data: '2024-01-01', pontos: -100, descricao: 'Resgate: O Senhor dos Anéis', tipo: 'gasto' },
  ];

  const ebooksRecentes = [
    { titulo: '1984', autor: 'George Orwell', dataResgate: '2024-01-03', pontos: 80 },
    { titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', dataResgate: '2024-01-01', pontos: 100 },
    { titulo: 'Dom Casmurro', autor: 'Machado de Assis', dataResgate: '2023-12-28', pontos: 60 },
  ];

  const promocoes = [
    { titulo: 'Promoção de Janeiro', descricao: '2x mais pontos em compras acima de R$ 50', validade: '2024-01-31' },
    { titulo: 'E-book Grátis', descricao: 'Resgate "O Pequeno Príncipe" por apenas 10 pontos', validade: '2024-01-20' },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle="Dashboard" />

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{saldoPontos}</div>
            <p className="text-xs text-muted-foreground">pontos disponíveis</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-books Resgatados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ebooksResgatados}</div>
            <p className="text-xs text-muted-foreground">livros na biblioteca</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Atividade</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15/01</div>
            <p className="text-xs text-muted-foreground">há 2 dias</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promoções Ativas</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promocoes.length}</div>
            <p className="text-xs text-muted-foreground">promoções disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Histórico de Pontos */}
        <Card className="bg-background/70 backdrop-blur-[6px] border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Histórico de Pontos
            </CardTitle>
            <CardDescription>Registro de todas as suas transações de pontos</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoPontos.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{new Date(item.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          item.tipo === 'recebido' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }
                      >
                        {item.tipo === 'recebido' ? '+' : ''}
                        {item.pontos}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.tipo === 'recebido' ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'
                        }
                      >
                        {item.tipo === 'recebido' ? 'Recebido' : 'Gasto'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* E-books Recentes */}
        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              E-books Recentes
            </CardTitle>
            <CardDescription>Seus últimos resgates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ebooksRecentes.map((ebook, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex-1">
                  <div className="font-medium text-sm">{ebook.titulo}</div>
                  <div className="text-xs text-muted-foreground">{ebook.autor}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(ebook.dataResgate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  <span className="text-xs font-medium">{ebook.pontos}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link href="/biblioteca">
                <Download className="mr-2 h-4 w-4" />
                Ver Biblioteca Completa
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Promoções */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Promoções Ativas
          </CardTitle>
          <CardDescription>Aproveite as ofertas especiais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {promocoes.map((promocao, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-background/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{promocao.titulo}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{promocao.descricao}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Válido até: {new Date(promocao.validade).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                    Ativa
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="secondary" className="h-auto p-4 flex-col gap-2" asChild>
              <Link href="/catalogo">
                <BookOpen className="h-6 w-6" />
                <span>Explorar Catálogo</span>
                <span className="text-xs text-muted-foreground">Resgatar novos e-books</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
              <Link href="/biblioteca">
                <Download className="h-6 w-6" />
                <span>Minha Biblioteca</span>
                <span className="text-xs text-muted-foreground">Ver e-books resgatados</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Gift className="h-6 w-6" />
              <span>Ver Promoções</span>
              <span className="text-xs text-muted-foreground">Ofertas especiais</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
