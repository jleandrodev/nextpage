import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star, Download, BookOpen, Eye } from 'lucide-react';

export default function DashboardPage() {
  // Categorias com imagens
  const categorias = [
    { nome: 'Autoajuda', imagem: '/images/autoajuda.jpg' },
    { nome: 'Desenvolvimento Pessoal', imagem: '/images/desenvolvimentopessoal.jpg' },
    { nome: 'Finanças', imagem: '/images/financas.jpg' },
    { nome: 'Aventura', imagem: '/images/aventura.jpg' },
    { nome: 'Drama', imagem: '/images/drama.jpg' },
    { nome: 'Culinária', imagem: '/images/receitas.jpg' },
  ];

  // E-books em destaque
  const ebooksDestaque = [
    {
      id: 1,
      titulo: 'O Poder do Hábito',
      autor: 'Charles Duhigg',
      imagem: '/images/autoajuda.jpg',
      avaliacao: 4.8,
      downloads: 1250,
      pontos: 80,
    },
    {
      id: 2,
      titulo: 'Pai Rico, Pai Pobre',
      autor: 'Robert Kiyosaki',
      imagem: '/images/financas.jpg',
      avaliacao: 4.6,
      downloads: 2100,
      pontos: 100,
    },
    {
      id: 3,
      titulo: 'O Senhor dos Anéis',
      autor: 'J.R.R. Tolkien',
      imagem: '/images/aventura.jpg',
      avaliacao: 4.9,
      downloads: 3400,
      pontos: 120,
    },
    {
      id: 4,
      titulo: 'Dom Casmurro',
      autor: 'Machado de Assis',
      imagem: '/images/drama.jpg',
      avaliacao: 4.7,
      downloads: 890,
      pontos: 60,
    },
    {
      id: 5,
      titulo: 'Receitas da Vovó',
      autor: 'Maria Silva',
      imagem: '/images/receitas.jpg',
      avaliacao: 4.5,
      downloads: 650,
      pontos: 50,
    },
    {
      id: 6,
      titulo: 'Mindset',
      autor: 'Carol Dweck',
      imagem: '/images/desenvolvimentopessoal.jpg',
      avaliacao: 4.8,
      downloads: 1800,
      pontos: 90,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Seção de Ícones Navegacionais */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore por Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categorias.map((categoria, index) => (
              <Link key={index} href={`/catalogo?categoria=${categoria.nome.toLowerCase()}`}>
                <div className="group cursor-pointer">
                  <div className="w-[180px] h-[180px] mx-auto rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Image
                      src={categoria.imagem}
                      alt={categoria.nome}
                      width={180}
                      height={180}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-center mt-3 text-gray-800 font-medium group-hover:text-gray-900 transition-colors">
                    {categoria.nome}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shelf de E-books */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">E-books em Destaque</h2>
            <Button variant="outline" asChild>
              <Link href="/catalogo">Ver Todos</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ebooksDestaque.map((ebook) => (
              <Card key={ebook.id} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={ebook.imagem}
                    alt={ebook.titulo}
                    width={300}
                    height={400}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{ebook.avaliacao}</span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{ebook.titulo}</CardTitle>
                  <CardDescription className="text-gray-600">{ebook.autor}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Download className="h-3 w-3" />
                      <span>{ebook.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white border border-gray-200">
                      <DialogHeader className="border-b border-gray-100 pb-4">
                        <DialogTitle className="text-xl text-gray-900">{ebook.titulo}</DialogTitle>
                        <DialogDescription className="text-gray-600">por {ebook.autor}</DialogDescription>
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
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Avaliação:</span>
                                <p className="font-medium text-gray-900">{ebook.avaliacao}/5.0</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Downloads:</span>
                                <p className="font-medium text-gray-900">{ebook.downloads.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sua Biblioteca</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white text-center">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-600">1,250</CardTitle>
                <CardDescription>Pontos Disponíveis</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white text-center">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-600">8</CardTitle>
                <CardDescription>E-books Resgatados</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white text-center">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-600">15</CardTitle>
                <CardDescription>Dias de Membro</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
