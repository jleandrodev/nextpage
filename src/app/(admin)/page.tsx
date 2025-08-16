'use client';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BookOpen, TrendingUp, Download, BarChart3, Calendar, Coins } from 'lucide-react';

export default function AdminRelatoriosPage() {
  // Dados mockados dos relatórios
  const metricas = {
    totalUsuarios: 1247,
    totalEbooks: 156,
    totalResgates: 3421,
    pontosDistribuidos: 125000,
  };

  const resgatesRecentes = [
    { usuario: 'João Silva', ebook: 'O Poder do Hábito', data: '2024-01-15', pontos: 150 },
    { usuario: 'Maria Santos', ebook: 'A Startup Enxuta', data: '2024-01-14', pontos: 200 },
    { usuario: 'Pedro Costa', ebook: 'O Monge e o Executivo', data: '2024-01-13', pontos: 120 },
    { usuario: 'Ana Oliveira', ebook: 'Pense e Enriqueça', data: '2024-01-12', pontos: 180 },
    { usuario: 'Carlos Lima', ebook: 'Como Fazer Amigos', data: '2024-01-11', pontos: 160 },
  ];

  const ebooksMaisPopulares = [
    { titulo: 'O Poder do Hábito', resgates: 245, categoria: 'Desenvolvimento Pessoal' },
    { titulo: 'A Startup Enxuta', resgates: 198, categoria: 'Negócios' },
    { titulo: 'O Monge e o Executivo', resgates: 156, categoria: 'Liderança' },
    { titulo: 'Pense e Enriqueça', resgates: 134, categoria: 'Motivação' },
    { titulo: 'Como Fazer Amigos', resgates: 112, categoria: 'Relacionamentos' },
  ];

  const categoriasMaisAtivas = [
    { categoria: 'Desenvolvimento Pessoal', resgates: 456, pontos: 68400 },
    { categoria: 'Negócios', resgates: 389, pontos: 77800 },
    { categoria: 'Liderança', resgates: 234, pontos: 28080 },
    { categoria: 'Motivação', resgates: 198, pontos: 35640 },
    { categoria: 'Relacionamentos', resgates: 167, pontos: 26720 },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle="Relatórios" />

      {/* Filtros */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                <SelectItem value="desenvolvimento">Desenvolvimento Pessoal</SelectItem>
                <SelectItem value="negocios">Negócios</SelectItem>
                <SelectItem value="lideranca">Liderança</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalUsuarios.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">usuários ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de E-books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalEbooks}</div>
            <p className="text-xs text-muted-foreground">livros disponíveis</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Resgates</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalResgates.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">resgates realizados</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Distribuídos</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.pontosDistribuidos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">pontos em circulação</p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Resgates Recentes */}
        <Card className="bg-background/70 backdrop-blur-[6px] border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Resgates Recentes
            </CardTitle>
            <CardDescription>Últimos resgates realizados pelos usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>E-book</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Pontos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resgatesRecentes.map((resgate, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{resgate.usuario}</TableCell>
                    <TableCell>{resgate.ebook}</TableCell>
                    <TableCell>{new Date(resgate.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        {resgate.pontos} pts
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* E-books Mais Populares */}
        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              E-books Mais Populares
            </CardTitle>
            <CardDescription>Top 5 mais resgatados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ebooksMaisPopulares.map((ebook, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex-1">
                  <div className="font-medium text-sm">{ebook.titulo}</div>
                  <div className="text-xs text-muted-foreground">{ebook.categoria}</div>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  <span className="text-xs font-medium">{ebook.resgates}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Categorias Mais Ativas */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Categorias Mais Ativas
          </CardTitle>
          <CardDescription>Desempenho por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Resgates</TableHead>
                <TableHead>Pontos Utilizados</TableHead>
                <TableHead>Média por Resgate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriasMaisAtivas.map((categoria, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{categoria.categoria}</TableCell>
                  <TableCell>{categoria.resgates.toLocaleString()}</TableCell>
                  <TableCell>{categoria.pontos.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{Math.round(categoria.pontos / categoria.resgates)} pts</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
