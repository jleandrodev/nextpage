'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Filter, BookOpen, Star, Eye, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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
}

export default function CatalogoPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recentes');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  const itemsPerPage = 12;

  // Dados mockados do catálogo
  const ebooksData = [
    {
      id: '2',
      title: 'A Startup Enxuta',
      author: 'Eric Ries',
      category: 'Negócios',
      coverImageUrl: '/images/financas.jpg',
      description: 'Metodologia para criar startups de sucesso',
      pointsCost: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'O Monge e o Executivo',
      author: 'James C. Hunter',
      category: 'Liderança',
      coverImageUrl: '/images/desenvolvimentopessoal.jpg',
      description: 'Uma história sobre a essência da liderança',
      pointsCost: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Pense e Enriqueça',
      author: 'Napoleon Hill',
      category: 'Motivação',
      coverImageUrl: '/images/autoajuda.jpg',
      description: 'Os princípios do sucesso financeiro',
      pointsCost: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Como Fazer Amigos',
      author: 'Dale Carnegie',
      category: 'Relacionamentos',
      coverImageUrl: '/images/drama.jpg',
      description: 'Técnicas para influenciar pessoas',
      pointsCost: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'A Última Palavra',
      author: 'Stephen R. Covey',
      category: 'Produtividade',
      coverImageUrl: '/images/desenvolvimentopessoal.jpg',
      description: 'Os 7 hábitos das pessoas altamente eficazes',
      pointsCost: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      title: 'O Milionário Automático',
      author: 'David Bach',
      category: 'Finanças',
      coverImageUrl: '/images/financas.jpg',
      description: 'Estratégias para construir riqueza automaticamente',
      pointsCost: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '8',
      title: 'A Arte da Guerra',
      author: 'Sun Tzu',
      category: 'Estratégia',
      coverImageUrl: '/images/aventura.jpg',
      description: 'Princípios milenares de estratégia e liderança',
      pointsCost: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '9',
      title: 'Receitas da Vovó',
      author: 'Maria Silva',
      category: 'Culinária',
      coverImageUrl: '/images/receitas.jpg',
      description: 'Tradicionais receitas de família',
      pointsCost: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  // Usar dados mockados
  useEffect(() => {
    setLoading(true);

    // Simular carregamento
    setTimeout(() => {
      setEbooks(ebooksData);
      setTotalPages(1);

      // Extrair categorias únicas dos dados mockados
      const uniqueCategories = Array.from(new Set(ebooksData.map((ebook: Ebook) => ebook.category)));
      setCategories(uniqueCategories);

      setLoading(false);
    }, 500);
  }, []);

  // Mapear categorias para imagens
  const getCategoriaImagem = (categoria: string) => {
    // Mapeamento simples de categorias para imagens
    const categoriaMap: { [key: string]: string } = {
      Autoajuda: '/images/autoajuda.jpg',
      'Desenvolvimento Pessoal': '/images/desenvolvimentopessoal.jpg',
      Finanças: '/images/financas.jpg',
      Aventura: '/images/aventura.jpg',
      Drama: '/images/drama.jpg',
      Culinária: '/images/receitas.jpg',
      Negócios: '/images/financas.jpg',
      Liderança: '/images/desenvolvimentopessoal.jpg',
      Motivação: '/images/autoajuda.jpg',
      Relacionamentos: '/images/drama.jpg',
      Produtividade: '/images/desenvolvimentopessoal.jpg',
      Estratégia: '/images/aventura.jpg',
    };
    return categoriaMap[categoria] || '/images/autoajuda.jpg';
  };

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar catálogo</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  // Filtrar ebooks baseado na categoria selecionada
  const ebooksFiltrados = categoriaSelecionada
    ? ebooks.filter((ebook) => ebook.category === categoriaSelecionada)
    : ebooks;

  const handleCategoriaClick = (categoria: string) => {
    setCategoriaSelecionada(categoria === categoriaSelecionada ? null : categoria);
    setCurrentPage(1);
  };

  const limparFiltro = () => {
    setCategoriaSelecionada(null);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header da página */}
      <div className="bg-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Catálogo de E-books</h1>
          <p className="text-gray-600 text-center">Explore nossa coleção completa de e-books</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtro ativo */}
        {categoriaSelecionada && (
          <div className="mb-6 flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1">
              Filtrado por: {categoriaSelecionada}
            </Badge>
            <Button variant="ghost" size="sm" onClick={limparFiltro} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Filtros */}
        <Card className="bg-white border border-gray-200 mb-8 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar e-books..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select
                value={categoriaSelecionada || 'todas'}
                onValueChange={(value) => setCategoriaSelecionada(value === 'todas' ? null : value)}
              >
                <SelectTrigger className="w-full sm:w-[200px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="todas" className="text-gray-700 hover:bg-gray-50">
                    Todas as Categorias
                  </SelectItem>
                  {categories.map((categoria) => (
                    <SelectItem key={categoria} value={categoria} className="text-gray-700 hover:bg-gray-50">
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-full sm:w-[150px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="recentes" className="text-gray-700 hover:bg-gray-50">
                    Mais Recentes
                  </SelectItem>
                  <SelectItem value="antigos" className="text-gray-700 hover:bg-gray-50">
                    Mais Antigos
                  </SelectItem>
                  <SelectItem value="titulo" className="text-gray-700 hover:bg-gray-50">
                    Título A-Z
                  </SelectItem>
                  <SelectItem value="pontos" className="text-gray-700 hover:bg-gray-50">
                    Menos Pontos
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando ebooks...</span>
          </div>
        )}

        {/* Grid de e-books */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ebooksFiltrados.map((ebook) => (
              <Card
                key={ebook.id}
                className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg overflow-hidden group"
              >
                {/* Imagem do e-book */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={ebook.coverImageUrl || getCategoriaImagem(ebook.category)}
                    alt={ebook.title}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Conteúdo do card */}
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <CardTitle className="text-base font-semibold line-clamp-2 mb-1 text-gray-900">
                        {ebook.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">por {ebook.author}</CardDescription>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{ebook.category}</span>
                      <span>{new Date(ebook.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{ebook.description}</p>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Resgatar
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white border border-gray-200">
                          <DialogHeader className="border-b border-gray-100 pb-4">
                            <DialogTitle className="text-xl text-gray-900">{ebook.title}</DialogTitle>
                            <DialogDescription className="text-gray-600">
                              por {ebook.author} • {ebook.category}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6 pt-4">
                            {/* Imagem e informações principais */}
                            <div className="flex gap-6">
                              <div className="w-32 h-48 overflow-hidden rounded-lg flex-shrink-0 border border-gray-200">
                                <Image
                                  src={ebook.coverImageUrl || getCategoriaImagem(ebook.category)}
                                  alt={ebook.title}
                                  width={128}
                                  height={192}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Categoria:</span>
                                    <p className="font-medium text-gray-900">{ebook.category}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Data:</span>
                                    <p className="font-medium text-gray-900">
                                      {new Date(ebook.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Descrição */}
                            <div className="border-t border-gray-100 pt-4">
                              <h4 className="font-semibold mb-2 text-gray-900">Descrição</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{ebook.description}</p>
                            </div>

                            {/* Botão de resgate */}
                            <div className="flex justify-end border-t border-gray-100 pt-4">
                              <Button className="w-full sm:w-auto">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Resgatar E-book
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center gap-2">
              {/* Botão Anterior */}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              {/* Números das páginas */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      size="sm"
                      className={`w-8 h-8 p-0 ${
                        page === currentPage
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-gray-500 px-2">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0 border-gray-300 hover:bg-gray-50"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              {/* Botão Próximo */}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && ebooksFiltrados.length === 0 && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {categoriaSelecionada
                    ? `Nenhum e-book encontrado na categoria "${categoriaSelecionada}"`
                    : 'Nenhum e-book encontrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {categoriaSelecionada
                    ? 'Tente selecionar outra categoria ou ajustar os filtros'
                    : 'Tente ajustar os filtros ou buscar por outro termo'}
                </p>
                {categoriaSelecionada && (
                  <Button onClick={limparFiltro} className="mr-2">
                    Limpar Filtro
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
