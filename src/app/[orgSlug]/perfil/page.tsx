'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface PerfilPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  points: number;
}

export default function PerfilPage({ params }: PerfilPageProps) {
  const [orgSlug, setOrgSlug] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const { toast } = useToast();

  // Carregar parâmetros
  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setOrgSlug(resolvedParams.orgSlug);
    };
    loadParams();
  }, [params]);

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/info');
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados do usuário',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome e email são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar perfil');
      }

      const result = await response.json();

      // Atualizar dados locais
      setUserInfo(result.user);

      toast({
        title: 'Sucesso!',
        description: 'Perfil atualizado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
            <span className="ml-2 text-black">Carregando perfil...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${orgSlug}/catalogo`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao catálogo
          </Link>
          <h1 className="text-3xl font-bold text-black mb-2">Meu Perfil</h1>
          <p className="text-black">Atualize suas informações pessoais</p>
        </div>

        {/* Card do perfil */}
        <Card className="bg-white border border-black">
          <CardHeader className="border-b border-black pb-4">
            <CardTitle className="text-xl text-black">Informações Pessoais</CardTitle>
            <CardDescription className="text-black">
              Mantenha seus dados atualizados para uma melhor experiência
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 border-black text-black placeholder:text-gray-600"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 border-black text-black placeholder:text-gray-600"
                    placeholder="Digite seu email"
                    required
                  />
                </div>
              </div>

              {/* Informações do usuário */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-black">Seu Saldo:</span>
                    <p className="text-black">{userInfo?.points || 0} ebooks para baixar</p>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving} className="flex-1 bg-black text-white hover:bg-gray-800">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      name: userInfo?.name || '',
                      email: userInfo?.email || '',
                    });
                  }}
                  className="border-black text-black hover:bg-gray-100"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
