'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Download, BookOpen, Eye } from 'lucide-react';

export default function BibliotecaPage() {
  // Dados mockados da biblioteca
  const meusEbooks = [
    {
      id: 1,
      titulo: 'O Poder do Hábito',
      autor: 'Charles Duhigg',
      dataResgate: '15/01/2024',
      imagem: '/images/autoajuda.jpg',
      paginas: 320,
      resumo:
        'Por que fazemos o que fazemos na vida e nos negócios? Charles Duhigg responde a essa pergunta com uma descoberta surpreendente: a chave para exercer regularmente, perder peso, educar bem os filhos, se tornar mais produtivo, criar empresas revolucionárias e ter sucesso é entender como os hábitos funcionam.',
      categoria: 'Desenvolvimento Pessoal',
      idioma: 'Português',
      formato: 'EPUB',
    },
    {
      id: 2,
      titulo: 'A Startup Enxuta',
      autor: 'Eric Ries',
      dataResgate: '10/01/2024',
      imagem: '/images/financas.jpg',
      paginas: 280,
      resumo:
        'Eric Ries define uma startup como uma organização dedicada a criar algo novo sob condições de extrema incerteza. Este é apenas um dos princípios fundamentais do movimento Lean Startup. O livro apresenta uma abordagem sistemática para criar e gerenciar startups de sucesso.',
      categoria: 'Negócios',
      idioma: 'Português',
      formato: 'EPUB',
    },
    {
      id: 3,
      titulo: 'O Monge e o Executivo',
      autor: 'James C. Hunter',
      dataResgate: '05/01/2024',
      imagem: '/images/desenvolvimentopessoal.jpg',
      paginas: 240,
      resumo:
        'Leonard Hoffman, um renomado executivo aposentado, se torna monge em um mosteiro beneditino. Lá, ele aprende sobre liderança servidora através de conversas profundas com Simeão, o abade do mosteiro. A história revela os princípios fundamentais da verdadeira liderança.',
      categoria: 'Liderança',
      idioma: 'Português',
      formato: 'EPUB',
    },
    {
      id: 4,
      titulo: 'Pense e Enriqueça',
      autor: 'Napoleon Hill',
      dataResgate: '20/12/2023',
      imagem: '/images/autoajuda.jpg',
      paginas: 350,
      resumo:
        'Baseado em entrevistas com mais de 500 das pessoas mais bem-sucedidas do mundo, incluindo Henry Ford, Thomas Edison e Alexander Graham Bell, Napoleon Hill revela os segredos do sucesso financeiro e pessoal através de princípios atemporais.',
      categoria: 'Motivação',
      idioma: 'Português',
      formato: 'EPUB',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header da página */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Minha Biblioteca</h1>
          <p className="text-gray-600 text-center">Seus e-books resgatados e favoritos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <Card className="bg-white border border-gray-200 mb-8 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar na biblioteca..."
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select>
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
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grid de e-books */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meusEbooks.map((ebook) => (
            <Card
              key={ebook.id}
              className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg overflow-hidden group"
            >
              {/* Imagem do e-book */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={ebook.imagem}
                  alt={ebook.titulo}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">{ebook.paginas} páginas</span>
                    <Badge className="bg-green-100 text-green-800 border border-green-200">Resgatado</Badge>
                  </div>
                </div>
              </div>

              {/* Conteúdo do card */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <CardTitle className="text-base font-semibold line-clamp-2 mb-1 text-gray-900">
                      {ebook.titulo}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">por {ebook.autor}</CardDescription>
                    <div className="text-xs text-gray-500 mt-1">Resgatado em {ebook.dataResgate}</div>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ler
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-white border border-gray-200">
                        <DialogHeader className="border-b border-gray-100 pb-4">
                          <DialogTitle className="text-xl text-gray-900">{ebook.titulo}</DialogTitle>
                          <DialogDescription className="text-gray-600">
                            por {ebook.autor} • {ebook.categoria}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 pt-4">
                          {/* Imagem e informações principais */}
                          <div className="flex gap-6">
                            <div className="w-32 h-48 overflow-hidden rounded-lg flex-shrink-0 border border-gray-200">
                              <Image
                                src={ebook.imagem}
                                alt={ebook.titulo}
                                width={128}
                                height={192}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-100 text-green-800 border border-green-200">
                                  Resgatado em {ebook.dataResgate}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Páginas:</span>
                                  <p className="font-medium text-gray-900">{ebook.paginas}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Idioma:</span>
                                  <p className="font-medium text-gray-900">{ebook.idioma}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Formato:</span>
                                  <p className="font-medium text-gray-900">{ebook.formato}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Categoria:</span>
                                  <p className="font-medium text-gray-900">{ebook.categoria}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Resumo */}
                          <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-semibold mb-2 text-gray-900">Resumo</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{ebook.resumo}</p>
                          </div>

                          {/* Botões de ação */}
                          <div className="flex gap-2 border-t border-gray-100 pt-4">
                            <Button className="flex-1">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Ler E-book
                            </Button>
                            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                              <Download className="h-4 w-4 mr-2" />
                              Download
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

        {/* Estado vazio */}
        {meusEbooks.length === 0 && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Sua biblioteca está vazia</h3>
                <p className="text-gray-600 mb-4">
                  Resgate seu primeiro e-book no catálogo para começar sua jornada de leitura
                </p>
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver Catálogo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
