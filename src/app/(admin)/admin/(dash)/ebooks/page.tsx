'use client';

import { useState, useEffect } from 'react';
import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, BookOpen, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { BatchUploadDialog } from '@/components/admin/ebooks/batch-upload-dialog';
import { toast } from '@/components/ui/use-toast';

interface Ebook {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImageUrl: string;
  description: string;
  pointsCost: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    redemptions: number;
  };
}

interface Stats {
  totalEbooks: number;
  totalRedemptions: number;
  mostPopularEbook: Ebook | null;
  averagePoints: number;
}

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEbooks, setTotalEbooks] = useState(0);

  // Buscar ebooks
  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        search: searchTerm,
      });

      const response = await fetch(`/api/admin/ebooks?${params}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar ebooks');
      }

      const data = await response.json();
      setEbooks(data.ebooks);
      setStats(data.stats);
      setTotalPages(data.totalPages);
      setTotalEbooks(data.total);
    } catch (error) {
      console.error('Erro ao buscar ebooks:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar ebooks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar ebooks quando a página carrega ou quando os filtros mudam
  useEffect(() => {
    fetchEbooks();
  }, [currentPage, searchTerm]);

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle="Gerenciar E-books" />

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de E-books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEbooks || 0}</div>
            <p className="text-xs text-muted-foreground">livros cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Resgates</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRedemptions || 0}</div>
            <p className="text-xs text-muted-foreground">resgates realizados</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-book Mais Popular</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats?.mostPopularEbook?.title || 'Nenhum'}</div>
            <p className="text-xs text-muted-foreground">{stats?.mostPopularEbook?._count.redemptions || 0} resgates</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Médios</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averagePoints || 0}</div>
            <p className="text-xs text-muted-foreground">por e-book</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
            <Input
              placeholder="Buscar e-books..."
              className="pl-8 bg-background/50 border-border text-white"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar E-book
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-[6px] border-border">
              <DialogHeader>
                <DialogTitle>Adicionar Novo E-book</DialogTitle>
                <DialogDescription>Preencha os dados do novo e-book</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input placeholder="Digite o título" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Autor</label>
                  <Input placeholder="Digite o autor" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Input placeholder="Digite a categoria" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pontos</label>
                  <Input type="number" placeholder="0" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capa</label>
                  <Input type="file" accept="image/*" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Arquivo</label>
                  <Input type="file" accept=".pdf,.epub" className="bg-background/50 border-border" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button variant="secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <BatchUploadDialog />
        </div>
      </div>

      {/* Tabela de E-books */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardHeader>
          <CardTitle>E-books Cadastrados</CardTitle>
          <CardDescription>Gerencie todos os e-books disponíveis na plataforma ({totalEbooks} total)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando ebooks...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Capa</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Resgates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ebooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-center">
                          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2 text-gray-900">Nenhum e-book encontrado</h3>
                          <p className="text-gray-600">
                            {searchTerm
                              ? 'Tente ajustar os filtros de busca'
                              : 'Comece adicionando seu primeiro e-book'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ebooks.map((ebook) => (
                      <TableRow key={ebook.id}>
                        <TableCell>
                          <div className="relative w-12 h-16 overflow-hidden rounded">
                            <Image
                              src={ebook.coverImageUrl || '/images/autoajuda.jpg'}
                              alt={ebook.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{ebook.title}</TableCell>
                        <TableCell>{ebook.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {ebook.category || 'Sem categoria'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{ebook.pointsCost}</span>
                            <span className="text-xs text-muted-foreground">pts</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                            {ebook._count.redemptions}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ebook.isActive ? 'default' : 'secondary'}>
                            {ebook.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Anterior
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
