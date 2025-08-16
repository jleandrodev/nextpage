
import { notFound } from 'next/navigation';
import { ArrowLeft, Edit, Image as ImageIcon, Users, BookOpen, Gift } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrganizationService } from '@/lib/services/organization.service';

interface OrganizationDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrganizationDetailsPage({ params }: OrganizationDetailsPageProps) {
  const { id } = await params;
  const organizationService = new OrganizationService();
  const organization = await organizationService.findById(id);

  if (!organization) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/lojistas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
          <p className="text-muted-foreground">Detalhes da organização</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/lojistas/${organization.id}/editar`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Link href={`/admin/lojistas/${organization.id}/imagens`}>
            <Button variant="outline">
              <ImageIcon className="mr-2 h-4 w-4" />
              Imagens
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais da organização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="text-lg font-semibold">{organization.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                <p className="text-lg font-mono">{organization.cnpj}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Slug</label>
                <p className="text-lg font-mono">{organization.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={organization.isActive ? 'default' : 'secondary'}>
                    {organization.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">URL de Acesso</label>
              <p className="text-lg font-mono text-primary">dominio.com/{organization.slug}/login</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Criado em</label>
              <p className="text-lg">
                {new Date(organization.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Resumo da organização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{organization._count?.users || 0}</p>
                <p className="text-sm text-muted-foreground">Usuários</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{organization._count?.ebooks || 0}</p>
                <p className="text-sm text-muted-foreground">Ebooks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{organization._count?.redemptions || 0}</p>
                <p className="text-sm text-muted-foreground">Resgates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Imagens da Organização</CardTitle>
            <CardDescription>Logos e imagens personalizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo</label>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {organization.logoUrl ? (
                    <img
                      src={organization.logoUrl}
                      alt="Logo da organização"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Nenhuma logo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Imagem de Login */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Imagem de Login</label>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  {organization.loginImageUrl ? (
                    <img
                      src={organization.loginImageUrl}
                      alt="Imagem de login"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Nenhuma imagem</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Imagem de Capa */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Imagem de Capa</label>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  {organization.coverHeroUrl ? (
                    <img
                      src={organization.coverHeroUrl}
                      alt="Imagem de capa"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Nenhuma imagem</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link href={`/admin/lojistas/${organization.id}/imagens`}>
                <Button variant="outline" className="w-full">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Gerenciar Imagens
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
