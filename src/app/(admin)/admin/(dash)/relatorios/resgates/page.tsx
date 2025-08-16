'use client';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, BarChart3, Calendar, User, BookOpen, Coins } from 'lucide-react';
import Image from 'next/image';

export default function AdminRelatoriosResgatesPage() {
  // Dados mockados
  const resgates = [
    {
      id: 1,
      cliente: 'João Silva',
      cpf: '123.456.789-00',
      ebook: '1984',
      autor: 'George Orwell',
      pontos: 80,
      dataResgate: '2024-01-15',
      capa: '/assets/icons/product-icons/basic-plan.png',
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      cpf: '987.654.321-00',
      ebook: 'O Senhor dos Anéis',
      autor: 'J.R.R. Tolkien',
      pontos: 100,
      dataResgate: '2024-01-14',
      capa: '/assets/icons/product-icons/free-plan.png',
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      cpf: '456.789.123-00',
      ebook: 'Dom Casmurro',
      autor: 'Machado de Assis',
      pontos: 60,
      dataResgate: '2024-01-13',
      capa: '/assets/icons/product-icons/pro-plan.png',
    },
    {
      id: 4,
      cliente: 'Ana Oliveira',
      cpf: '789.123.456-00',
      ebook: 'O Hobbit',
      autor: 'J.R.R. Tolkien',
      pontos: 90,
      dataResgate: '2024-01-12',
      capa: '/assets/icons/product-icons/free-plan.png',
    },
    {
      id: 5,
      cliente: 'Carlos Ferreira',
      cpf: '321.654.987-00',
      ebook: '1984',
      autor: 'George Orwell',
      pontos: 80,
      dataResgate: '2024-01-11',
      capa: '/assets/icons/product-icons/basic-plan.png',
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle="Relatório de Resgates" />

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Resgates</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resgates.length}</div>
            <p className="text-xs text-muted-foreground">resgates realizados</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(resgates.map((r) => r.cpf)).size}</div>
            <p className="text-xs text-muted-foreground">clientes ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Utilizados</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resgates.reduce((total, resgate) => total + resgate.pontos, 0)}</div>
            <p className="text-xs text-muted-foreground">pontos gastos</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-book Mais Popular</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">1984</div>
            <p className="text-xs text-muted-foreground">2 resgates</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os resgates por diferentes critérios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar Cliente</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="CPF ou nome..." className="pl-8 bg-background/50 border-border" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">E-book</label>
              <Select>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue placeholder="Todos os e-books" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os e-books</SelectItem>
                  <SelectItem value="1984">1984</SelectItem>
                  <SelectItem value="senhor-dos-aneis">O Senhor dos Anéis</SelectItem>
                  <SelectItem value="dom-casmurro">Dom Casmurro</SelectItem>
                  <SelectItem value="hobbit">O Hobbit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Inicial</label>
              <Input type="date" className="bg-background/50 border-border" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Final</label>
              <Input type="date" className="bg-background/50 border-border" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Resgates */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardHeader>
          <CardTitle>Resgates Realizados</CardTitle>
          <CardDescription>Lista completa de todos os resgates de e-books</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>E-book</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resgates.map((resgate) => (
                <TableRow key={resgate.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="font-medium">{resgate.cliente}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{resgate.cpf}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-10 overflow-hidden rounded">
                        <Image src={resgate.capa} alt={resgate.ebook} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{resgate.ebook}</div>
                        <div className="text-xs text-muted-foreground">{resgate.autor}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      <span className="text-sm font-medium">{resgate.pontos}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{new Date(resgate.dataResgate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
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
