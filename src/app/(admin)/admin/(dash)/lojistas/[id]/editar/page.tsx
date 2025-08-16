'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { updateOrganizationAction, checkSlugAvailabilityAction } from '@/app/actions/organization.actions';

interface EditarLojistaPageProps {
  params: Promise<{ id: string }>;
}

export default function EditarLojistaPage({ params }: EditarLojistaPageProps) {
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState<string>('');
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const loadParams = async () => {
      const resolved = await params;
      setOrganizationId(resolved.id);
      setResolvedParams(resolved);
    };
    loadParams();
  }, [params]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loginImagePreview, setLoginImagePreview] = useState<string | null>(null);
  const [coverHeroPreview, setCoverHeroPreview] = useState<string | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    cnpj: '',
    slug: '',
    logoFile: null as File | null,
    loginImageFile: null as File | null,
    coverHeroFile: null as File | null,
  });

  // Carregar dados da organização
  useEffect(() => {
    if (!organizationId) return;

    const loadOrganization = async () => {
      try {
        console.log('🔍 Carregando organização:', organizationId);

        // Tentar primeiro a API do admin
        let response = await fetch(`/api/admin/organizations/${organizationId}`);
        console.log('📡 Resposta da API admin:', response.status);

        if (!response.ok) {
          // Se falhar, tentar a API pública
          console.log('🔄 Tentando API pública...');
          response = await fetch(`/api/organizations/${organizationId}`);
          console.log('📡 Resposta da API pública:', response.status);
        }

        if (response.ok) {
          const organization = await response.json();
          console.log('✅ Organização carregada:', organization.name);

          setFormData({
            id: organization.id,
            name: organization.name,
            cnpj: organization.cnpj,
            slug: organization.slug,
            logoFile: null,
            loginImageFile: null,
            coverHeroFile: null,
          });

          // Definir previews das imagens existentes
          if (organization.logoUrl) {
            setLogoPreview(organization.logoUrl);
          }
          if (organization.loginImageUrl) {
            setLoginImagePreview(organization.loginImageUrl);
          }
          if (organization.coverHeroUrl) {
            setCoverHeroPreview(organization.coverHeroUrl);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Erro na API:', errorData);

          toast({
            title: 'Erro',
            description: errorData.error || 'Organização não encontrada',
            variant: 'destructive',
          });
          router.push('/admin/lojistas');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar organização:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados da organização',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadOrganization();
  }, [organizationId, router]);

  // Verificar disponibilidade do slug
  useEffect(() => {
    const checkSlug = async () => {
      if (formData.slug && formData.slug.length > 2) {
        const result = await checkSlugAvailabilityAction(formData.slug, formData.id);
        if (result.success && typeof result.available === 'boolean') {
          setSlugAvailable(result.available);
        }
      }
    };

    const timeoutId = setTimeout(checkSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.slug, formData.id]);

  // Gerar slug automaticamente baseado no nome
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  // Função para gerar slug
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplos
      .trim();
  };

  // Handle file upload para logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 Logo upload triggered');
    const file = e.target.files?.[0];
    if (file) {
      console.log('📄 Logo file selected:', file.name, file.size, 'bytes');
      setFormData((prev) => ({ ...prev, logoFile: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        console.log('🖼️ Logo preview set');
      };
      reader.readAsDataURL(file);
    } else {
      console.log('❌ No logo file selected');
    }
  };

  // Handle file upload para imagem de login
  const handleLoginImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 Login image upload triggered');
    const file = e.target.files?.[0];
    if (file) {
      console.log('📄 Login image file selected:', file.name, file.size, 'bytes');

      // Validar tamanho (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: 'Erro',
          description: `Arquivo muito grande. Tamanho máximo: 10MB`,
          variant: 'destructive',
        });
        return;
      }

      setFormData((prev) => ({ ...prev, loginImageFile: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setLoginImagePreview(e.target?.result as string);
        console.log('🖼️ Login image preview set');
      };
      reader.readAsDataURL(file);
    } else {
      console.log('❌ No login image file selected');
    }
  };

  // Handle file upload para imagem de capa
  const handleCoverHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 Cover hero upload triggered');
    const file = e.target.files?.[0];
    if (file) {
      console.log('📄 Cover hero file selected:', file.name, file.size, 'bytes');
      setFormData((prev) => ({ ...prev, coverHeroFile: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverHeroPreview(e.target?.result as string);
        console.log('🖼️ Cover hero preview set');
      };
      reader.readAsDataURL(file);
    } else {
      console.log('❌ No cover hero file selected');
    }
  };

  // Remover preview de logo
  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logoFile: null }));
    setLogoPreview(null);
  };

  // Remover preview de imagem de login
  const removeLoginImage = () => {
    setFormData((prev) => ({ ...prev, loginImageFile: null }));
    setLoginImagePreview(null);
  };

  // Remover preview de imagem de capa
  const removeCoverHero = () => {
    setFormData((prev) => ({ ...prev, coverHeroFile: null }));
    setCoverHeroPreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar dados obrigatórios
      if (!formData.name || !formData.cnpj || !formData.slug) {
        toast({
          title: 'Erro',
          description: 'Preencha todos os campos obrigatórios',
          variant: 'destructive',
        });
        return;
      }

      // Verificar se o slug está disponível
      if (slugAvailable === false) {
        toast({
          title: 'Erro',
          description: 'Este slug já está em uso. Escolha outro.',
          variant: 'destructive',
        });
        return;
      }

      // Preparar dados para envio
      const updateData: any = {
        id: formData.id,
        name: formData.name,
        cnpj: formData.cnpj,
        slug: formData.slug,
      };

      // Fazer upload das imagens se houver
      if (formData.logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('file', formData.logoFile);
        logoFormData.append('imageType', 'logo');

        const logoResponse = await fetch(`/api/admin/organizations/${formData.id}/upload-image`, {
          method: 'POST',
          body: logoFormData,
        });

        if (!logoResponse.ok) {
          throw new Error('Erro ao fazer upload da logo');
        }
      }

      if (formData.loginImageFile) {
        const loginFormData = new FormData();
        loginFormData.append('file', formData.loginImageFile);
        loginFormData.append('imageType', 'loginImage');

        const loginResponse = await fetch(`/api/admin/organizations/${formData.id}/upload-image`, {
          method: 'POST',
          body: loginFormData,
        });

        if (!loginResponse.ok) {
          throw new Error('Erro ao fazer upload da imagem de login');
        }
      }

      if (formData.coverHeroFile) {
        const coverFormData = new FormData();
        coverFormData.append('file', formData.coverHeroFile);
        coverFormData.append('imageType', 'coverHero');

        const coverResponse = await fetch(`/api/admin/organizations/${formData.id}/upload-image`, {
          method: 'POST',
          body: coverFormData,
        });

        if (!coverResponse.ok) {
          throw new Error('Erro ao fazer upload da imagem de capa');
        }
      }

      // Atualizar organização
      const result = await updateOrganizationAction(updateData);

      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'Organização atualizada com sucesso',
        });
        router.push(`/admin/lojistas/${formData.id}`);
      } else {
        toast({
          title: 'Erro',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar organização:', error);
      toast({
        title: 'Erro',
        description: 'Erro interno do servidor',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando dados da organização...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/lojistas/${resolvedParams?.id || ''}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Lojista</h1>
          <p className="text-muted-foreground">Atualize as informações da organização</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais da organização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Organização *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Digite o nome da organização"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cnpj: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="nome-da-organizacao"
                required
              />
              {formData.slug && (
                <p className="text-sm text-muted-foreground">
                  URL: dominio.com/{formData.slug}/login
                  {slugAvailable !== null && (
                    <span className={`ml-2 ${slugAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {slugAvailable ? '✓ Disponível' : '✗ Já em uso'}
                    </span>
                  )}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload de Imagens */}
        <Card>
          <CardHeader>
            <CardTitle>Imagens da Organização</CardTitle>
            <CardDescription>Logos e imagens de fundo personalizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo da Organização</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      console.log('🎯 Logo button clicked');
                      document.getElementById('logo-upload')?.click();
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Logo
                  </Button>
                </div>
                {logoPreview && (
                  <div className="relative">
                    <img src={logoPreview} alt="Preview logo" className="w-16 h-16 object-contain border rounded" />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={removeLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Recomendado: PNG ou SVG, 200x200px, máximo 2MB</p>
            </div>

            {/* Imagem de Login */}
            <div className="space-y-2">
              <Label>Imagem de Fundo do Login</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLoginImageUpload}
                    className="hidden"
                    id="login-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      console.log('🎯 Login image button clicked');
                      document.getElementById('login-image-upload')?.click();
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Imagem
                  </Button>
                </div>
                {loginImagePreview && (
                  <div className="relative">
                    <img
                      src={loginImagePreview}
                      alt="Preview login"
                      className="w-16 h-16 object-cover border rounded"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={removeLoginImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Recomendado: JPG ou PNG, 1200x800px, máximo 15MB</p>
            </div>

            {/* Imagem de Capa */}
            <div className="space-y-2">
              <Label>Imagem de Capa do Catálogo</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverHeroUpload}
                    className="hidden"
                    id="cover-hero-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      console.log('🎯 Cover hero button clicked');
                      document.getElementById('cover-hero-upload')?.click();
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Imagem
                  </Button>
                </div>
                {coverHeroPreview && (
                  <div className="relative">
                    <img src={coverHeroPreview} alt="Preview capa" className="w-16 h-16 object-cover border rounded" />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={removeCoverHero}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Recomendado: JPG ou PNG, 1920x600px, máximo 15MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <Link href={`/admin/lojistas/${resolvedParams?.id || ''}`}>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
