'use client';

import { useState, useEffect } from 'react';
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
import { Search, Download, BookOpen, Eye, Loader2 } from 'lucide-react';
import { useUserRedemptions } from '@/hooks/useUserRedemptions';
import { useToast } from '@/components/ui/use-toast';
import { DownloadConfirmationModal } from '@/components/shared/download-confirmation-modal';

interface BibliotecaPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
}

export default function BibliotecaPage({ params }: BibliotecaPageProps) {
  const [orgSlug, setOrgSlug] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<any>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [downloading, setDownloading] = useState(false);

  const { redemptions, loading, error } = useUserRedemptions();
  const { toast } = useToast();

  useEffect(() => {
    params.then(({ orgSlug }) => setOrgSlug(orgSlug));
  }, [params]);

  // Buscar pontos do usuário
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user/info');
        if (response.ok) {
          const data = await response.json();
          setUserPoints(data.points || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Filtrar ebooks baseado na busca e categoria
  const filteredRedemptions = redemptions.filter((redemption) => {
    const ebook = redemption.ebook;
    const matchesSearch =
      searchTerm === '' ||
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || ebook.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Obter categorias únicas
  const categories = [...new Set(redemptions.map((r) => r.ebook.category).filter(Boolean))];

  const handleDownloadClick = (redemption: any) => {
    setSelectedEbook(redemption);
    setDownloadModalOpen(true);
  };

  const handleDownloadConfirm = async () => {
    if (!selectedEbook) return;

    setDownloading(true);
    try {
      // Primeiro, processar o download (debitar pontos)
      const downloadResult = await fetch('/api/ebooks/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ebookId: selectedEbook.ebook.id,
          organizationId: selectedEbook.organizationId,
          pointsCost: selectedEbook.ebook.pointsCost,
        }),
      });

      if (!downloadResult.ok) {
        const errorData = await downloadResult.json();
        throw new Error(errorData.error || 'Erro ao processar download');
      }

      const result = await downloadResult.json();

      // Atualizar pontos do usuário
      setUserPoints(result.newBalance);

      // Depois, fazer o download do arquivo
      const fileResponse = await fetch('/api/download-ebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: selectedEbook.ebook.ebookFileUrl,
          title: selectedEbook.ebook.title,
          ebookId: selectedEbook.ebook.id,
        }),
      });

      if (!fileResponse.ok) {
        throw new Error('Erro ao baixar arquivo');
      }

      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedEbook.ebook.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Sucesso!',
        description: 'Download iniciado com sucesso',
      });

      setDownloadModalOpen(false);
      setSelectedEbook(null);
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao baixar o arquivo. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
            <span className="ml-2 text-black">Carregando sua biblioteca...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-black mb-4 bg-white p-4 rounded-lg border border-black">
              Erro ao carregar biblioteca: {error}
            </p>
            <Button onClick={() => window.location.reload()} className="bg-black text-white hover:bg-gray-800">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Minha Biblioteca</h1>
          <p className="text-black">
            Seus ebooks resgatados estão aqui. Você tem {redemptions.length} ebook{redemptions.length !== 1 ? 's' : ''}{' '}
            na sua biblioteca.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
              <Input
                placeholder="Buscar por título ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-black text-black placeholder:text-gray-600"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 border-black text-black">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent className="bg-white border-black">
              <SelectItem value="all" className="text-black hover:bg-gray-100">
                Todas as categorias
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category!} className="text-black hover:bg-gray-100">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Ebooks */}
        {filteredRedemptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRedemptions.map((redemption) => (
              <Card
                key={redemption.id}
                className="bg-white border border-black hover:shadow-lg transition-shadow duration-200"
              >
                {/* Imagem da capa */}
                <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  {redemption.ebook.coverImageUrl ? (
                    <Image
                      src={redemption.ebook.coverImageUrl}
                      alt={redemption.ebook.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 bg-black text-white">Resgatado</Badge>
                </div>

                {/* Conteúdo do card */}
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <CardTitle className="text-base font-semibold line-clamp-2 mb-1 text-black">
                        {redemption.ebook.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-black">por {redemption.ebook.author}</CardDescription>
                    </div>

                    <div className="flex items-center justify-between text-xs text-black">
                      <span>{redemption.ebook.category}</span>
                      <span>Resgatado em {new Date(redemption.redeemedAt).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {redemption.ebook.description && (
                      <p className="text-sm text-black line-clamp-2">{redemption.ebook.description}</p>
                    )}

                    {/* Botões em coluna - apenas 2 botões */}
                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full bg-black text-white hover:bg-gray-800"
                        size="sm"
                        onClick={() => handleDownloadClick(redemption)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-black text-black hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white border border-black">
                          <DialogHeader className="border-b border-black pb-4">
                            <DialogTitle className="text-xl text-black">{redemption.ebook.title}</DialogTitle>
                            <DialogDescription className="text-black">
                              por {redemption.ebook.author} • {redemption.ebook.category}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6 pt-4">
                            {redemption.ebook.coverImageUrl && (
                              <div className="flex justify-center">
                                <Image
                                  src={redemption.ebook.coverImageUrl}
                                  alt={redemption.ebook.title}
                                  width={200}
                                  height={300}
                                  className="rounded-lg shadow-md"
                                />
                              </div>
                            )}

                            {redemption.ebook.description && (
                              <div>
                                <h4 className="font-medium text-black mb-2">Sinopse</h4>
                                <p className="text-black text-sm leading-relaxed">{redemption.ebook.description}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-black">Categoria:</span>
                                <p className="text-black">{redemption.ebook.category}</p>
                              </div>

                              <div>
                                <span className="font-medium text-black">Data do resgate:</span>
                                <p className="text-black">
                                  {new Date(redemption.redeemedAt).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>

                            {/* Botão de download no modal */}
                            <div className="flex gap-2 border-t border-black pt-4">
                              <Button
                                className="flex-1 bg-black text-white hover:bg-gray-800"
                                onClick={() => handleDownloadClick(redemption)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Baixar
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
        ) : (
          /* Estado vazio */
          <Card className="bg-white border border-black">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-black mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black">
                  {searchTerm || selectedCategory !== 'all' ? 'Nenhum ebook encontrado' : 'Sua biblioteca está vazia'}
                </h3>
                <p className="text-black mb-4">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Resgate seu primeiro e-book no catálogo para começar sua jornada de leitura'}
                </p>
                <Button asChild className="bg-black text-white hover:bg-gray-800">
                  <a href={`/${orgSlug}/catalogo`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ver Catálogo
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de confirmação de download */}
      {selectedEbook && (
        <DownloadConfirmationModal
          isOpen={downloadModalOpen}
          onClose={() => {
            setDownloadModalOpen(false);
            setSelectedEbook(null);
          }}
          onConfirm={handleDownloadConfirm}
          ebookTitle={selectedEbook.ebook.title}
          pointsCost={selectedEbook.ebook.pointsCost}
          userPoints={userPoints}
          loading={downloading}
        />
      )}
    </div>
  );
}
