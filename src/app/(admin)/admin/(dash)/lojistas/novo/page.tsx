'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { createOrganizationAction } from '@/app/actions/organization.actions';

export default function NovoLojistaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loginImagePreview, setLoginImagePreview] = useState<string | null>(null);
  const [coverHeroPreview, setCoverHeroPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    slug: '',
    logoFile: null as File | null,
    loginImageFile: null as File | null,
    coverHeroFile: null as File | null,
  });

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
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logoFile: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload para imagem de login
  const handleLoginImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, loginImageFile: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setLoginImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload para imagem de capa
  const handleCoverHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverHeroFile: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverHeroPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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

  // Submeter formulário
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

      // Criar organização primeiro
      const result = await createOrganizationAction({
        name: formData.name,
        cnpj: formData.cnpj,
        slug: formData.slug,
      });

      if (!result.success) {
        toast({
          title: 'Erro',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      const organizationId = result.data.id;

      // Fazer upload das imagens se houver
      if (formData.logoFile) {
        console.log('📤 Fazendo upload da logo...');
        const logoFormData = new FormData();
        logoFormData.append('file', formData.logoFile);
        logoFormData.append('imageType', 'logo');

        const logoResponse = await fetch(`/api/admin/organizations/${organizationId}/upload-image`, {
          method: 'POST',
          body: logoFormData,
        });

        console.log('📡 Resposta do upload da logo:', logoResponse.status);
        if (!logoResponse.ok) {
          const errorData = await logoResponse.json().catch(() => ({}));
          console.error('❌ Erro ao fazer upload da logo:', errorData);
        } else {
          const result = await logoResponse.json();
          console.log('✅ Logo enviada com sucesso:', result);
        }
      }

      if (formData.loginImageFile) {
        console.log('📤 Fazendo upload da imagem de login...');
        const loginFormData = new FormData();
        loginFormData.append('file', formData.loginImageFile);
        loginFormData.append('imageType', 'loginImage');

        const loginResponse = await fetch(`/api/admin/organizations/${organizationId}/upload-image`, {
          method: 'POST',
          body: loginFormData,
        });

        console.log('📡 Resposta do upload da imagem de login:', loginResponse.status);
        if (!loginResponse.ok) {
          const errorData = await loginResponse.json().catch(() => ({}));
          console.error('❌ Erro ao fazer upload da imagem de login:', errorData);
        } else {
          const result = await loginResponse.json();
          console.log('✅ Imagem de login enviada com sucesso:', result);
        }
      }

      if (formData.coverHeroFile) {
        console.log('📤 Fazendo upload da imagem de capa...');
        const coverFormData = new FormData();
        coverFormData.append('file', formData.coverHeroFile);
        coverFormData.append('imageType', 'coverHero');

        const coverResponse = await fetch(`/api/admin/organizations/${organizationId}/upload-image`, {
          method: 'POST',
          body: coverFormData,
        });

        console.log('📡 Resposta do upload da imagem de capa:', coverResponse.status);
        if (!coverResponse.ok) {
          const errorData = await coverResponse.json().catch(() => ({}));
          console.error('❌ Erro ao fazer upload da imagem de capa:', errorData);
        } else {
          const result = await coverResponse.json();
          console.log('✅ Imagem de capa enviada com sucesso:', result);
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Lojista criado com sucesso.',
      });
      router.push('/admin/lojistas');
    } catch (error) {
      console.error('Erro ao criar organização:', error);
      toast({
        title: 'Erro',
        description: 'Erro interno do servidor',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/lojistas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Lojista</h1>
          <p className="text-muted-foreground">Cadastre uma nova organização no sistema white label</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Lojista</CardTitle>
            <CardDescription>Preencha as informações básicas da organização</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados básicos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Loja ABC Ltda"
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
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="loja-abc"
                  required
                />
                <p className="text-sm text-muted-foreground">URL de acesso: dominio.com/{formData.slug}/login</p>
              </div>

              {/* Upload de logo */}
              <div className="space-y-2">
                <Label>Logo do Lojista</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img src={logoPreview} alt="Preview logo" className="w-20 h-20 object-contain border rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={removeLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-auto"
                      id="logo-upload-new"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Será exibida no header do cliente e na página de login
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload de imagem de login */}
              <div className="space-y-2">
                <Label>Imagem da Página de Login</Label>
                <div className="flex items-center gap-4">
                  {loginImagePreview ? (
                    <div className="relative">
                      <img
                        src={loginImagePreview}
                        alt="Preview imagem login"
                        className="w-32 h-20 object-cover border rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={removeLoginImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <Input type="file" accept="image/*" onChange={handleLoginImageUpload} className="w-auto" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Imagem que divide a tela com o formulário de login
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload de imagem de capa */}
              <div className="space-y-2">
                <Label>Imagem de Capa do Lojista</Label>
                <div className="flex items-center gap-4">
                  {coverHeroPreview ? (
                    <div className="relative">
                      <img
                        src={coverHeroPreview}
                        alt="Preview imagem capa"
                        className="w-40 h-24 object-cover border rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={removeCoverHero}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-40 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <Input type="file" accept="image/*" onChange={handleCoverHeroUpload} className="w-auto" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Imagem de capa que será exibida na página do catálogo (recomendado: 1200x400px, máximo 15MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Criando...' : 'Criar Lojista'}
                </Button>
                <Link href="/admin/lojistas">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
