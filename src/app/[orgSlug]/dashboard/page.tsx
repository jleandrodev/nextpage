import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Coins, BookOpen, Trophy, User, Eye } from 'lucide-react';
import { OrganizationService } from '@/lib/services/organization.service';
import { EbookService } from '@/lib/services/ebook.service';
import { RedemptionService } from '@/lib/services/redemption.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OrganizationHeader } from '@/components/organization/organization-header';
import { authOptions } from '@/lib/auth';

interface OrganizationDashboardPageProps {
  params: Promise<{ orgSlug: string }>;
}

export default async function OrganizationDashboardPage({ params }: OrganizationDashboardPageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${resolvedParams.orgSlug}/login`);
  }

  // Verificar se o usuário pertence à organização correta
  if (session.user.role === 'CLIENTE' && session.user.organization?.slug !== resolvedParams.orgSlug) {
    redirect(`/${resolvedParams.orgSlug}/login`);
  }

  const organizationService = new OrganizationService();
  const organization = await organizationService.findBySlug(resolvedParams.orgSlug);

  if (!organization || !organization.isActive) {
    notFound();
  }

  const ebookService = new EbookService();
  const redemptionService = new RedemptionService();

  // Buscar ebooks disponíveis para a organização
  const ebooks = await ebookService.findByOrganization(resolvedParams.orgSlug);

  // Buscar redemptions do usuário
  const redemptions = await redemptionService.findByUser(session.user.id);

  const user = {
    id: session.user.id,
    name: session.user.name || 'Usuário',
    cpf: session.user.cpf,
    points: session.user.points,
    redemptions: redemptions.length,
  };

  const recentRedemptions = redemptions.slice(0, 3); // Últimos 3 redemptions

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <OrganizationHeader organization={organization} user={user} />

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos Disponíveis</CardTitle>
              <Coins className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{user.points}</div>
              <p className="text-xs text-muted-foreground">Cada ebook custa 1 ponto</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ebooks Disponíveis</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{ebooks.length}</div>
              <p className="text-xs text-muted-foreground">No catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resgates Realizados</CardTitle>
              <Trophy className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{user.redemptions}</div>
              <p className="text-xs text-muted-foreground">Ebooks resgatados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ebooks Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Ebooks Disponíveis</CardTitle>
              <CardDescription>Escolha um ebook para resgatar com seus pontos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ebooks.map((ebook) => (
                <div key={ebook.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{ebook.title}</h4>
                    <p className="text-sm text-muted-foreground">{ebook.author}</p>
                    <Badge variant="secondary" className="mt-1">
                      {ebook.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
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
                          {/* Informações principais */}
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Categoria:</span>
                                <p className="font-medium text-gray-900">{ebook.category}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Status:</span>
                                <Badge variant="secondary" className="mt-1">
                                  {ebook.isActive ? 'Disponível' : 'Indisponível'}
                                </Badge>
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
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <Button variant="outline" asChild>
                  <a href={`/${organization.slug}/catalogo`}>Ver Catálogo Completo</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resgates Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Resgates Recentes</CardTitle>
              <CardDescription>Seus últimos ebooks resgatados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentRedemptions.length > 0 ? (
                <>
                  {recentRedemptions.map((redemption) => (
                    <div key={redemption.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{redemption.ebook.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Resgatado em {new Date(redemption.redeemedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <a href={`/${organization.slug}/biblioteca`}>Ver Minha Biblioteca</a>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Você ainda não resgatou nenhum ebook</p>
                  <Button className="mt-4" asChild>
                    <a href={`/${organization.slug}/catalogo`}>Explorar Catálogo</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
