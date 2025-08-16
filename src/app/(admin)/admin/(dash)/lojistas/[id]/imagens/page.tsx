import { notFound } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrganizationService } from '@/lib/services/organization.service';
import { ImageManager } from '@/components/admin/lojistas/image-manager';

interface OrganizationImagesPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrganizationImagesPage({ params }: OrganizationImagesPageProps) {
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
        <Link href={`/admin/lojistas/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Imagens</h1>
          <p className="text-muted-foreground">
            {organization.name} - Upload e gerenciamento de imagens personalizadas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Logo da Organização
            </CardTitle>
            <CardDescription>Logo que aparece no header e na página de login</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageManager
              organizationId={organization.id}
              imageType="logo"
              currentImageUrl={organization.logoUrl}
              organizationName={organization.name}
            />
          </CardContent>
        </Card>

        {/* Imagem de Login */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Imagem de Fundo do Login
            </CardTitle>
            <CardDescription>Imagem que divide a tela com o formulário de login</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageManager
              organizationId={organization.id}
              imageType="loginImage"
              currentImageUrl={organization.loginImageUrl}
              organizationName={organization.name}
            />
          </CardContent>
        </Card>

        {/* Imagem de Capa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Imagem de Capa do Catálogo
            </CardTitle>
            <CardDescription>Imagem de capa que aparece na página do catálogo</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageManager
              organizationId={organization.id}
              imageType="coverHero"
              currentImageUrl={organization.coverHeroUrl}
              organizationName={organization.name}
            />
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview das Imagens
            </CardTitle>
            <CardDescription>Como as imagens aparecem nas páginas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview do Header */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Header (Logo)</label>
              <div className="h-16 bg-white border rounded-lg flex items-center px-4">
                {organization.logoUrl ? (
                  <img src={organization.logoUrl} alt="Logo preview" className="h-8 object-contain" />
                ) : (
                  <div className="text-sm text-gray-500">Sem logo</div>
                )}
                <div className="ml-4 text-sm font-medium">{organization.name}</div>
              </div>
            </div>

            {/* Preview da Página de Login */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Página de Login</label>
              <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden">
                {organization.loginImageUrl ? (
                  <img src={organization.loginImageUrl} alt="Login preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Sem imagem de fundo</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-sm font-medium">Formulário de Login</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview do Catálogo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Página do Catálogo</label>
              <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden">
                {organization.coverHeroUrl ? (
                  <img src={organization.coverHeroUrl} alt="Catalog preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Sem imagem de capa</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-lg font-bold">{organization.name}</h3>
                    <p className="text-sm opacity-90">Catálogo de Ebooks</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Importantes */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Logo</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Formato: PNG ou SVG</li>
                <li>• Tamanho: 200x200px</li>
                <li>• Máximo: 2MB</li>
                <li>• Fundo transparente recomendado</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Imagem de Login</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Formato: JPG ou PNG</li>
                <li>• Tamanho: 1200x800px</li>
                <li>• Máximo: 15MB</li>
                <li>• Boa qualidade visual</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Imagem de Capa</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Formato: JPG ou PNG</li>
                <li>• Tamanho: 1920x600px</li>
                <li>• Máximo: 15MB</li>
                <li>• Alta resolução</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Dicas</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• As imagens são otimizadas automaticamente pelo sistema</li>
              <li>• Use imagens de alta qualidade para melhor experiência</li>
              <li>• Teste as imagens em diferentes dispositivos</li>
              <li>• Mantenha backup das imagens originais</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
