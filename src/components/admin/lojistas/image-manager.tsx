'use client';

import { useState, useRef } from 'react';
import { Upload, X, Eye, Trash2, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImageManagerProps {
  organizationId: string;
  imageType: 'logo' | 'loginImage' | 'coverHero';
  currentImageUrl?: string | null;
  organizationName: string;
}

export function ImageManager({ organizationId, imageType, currentImageUrl, organizationName }: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageTypeConfig = {
    logo: {
      label: 'Logo',
      description: 'Logo da organização',
      bucket: 'logos',
      maxSize: 2 * 1024 * 1024, // 2MB
      acceptedTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
    },
    loginImage: {
      label: 'Imagem de Login',
      description: 'Imagem de fundo da página de login',
      bucket: 'login-images',
      maxSize: 5 * 1024 * 1024, // 5MB
      acceptedTypes: ['image/png', 'image/jpeg', 'image/webp'],
    },
    coverHero: {
      label: 'Imagem de Capa',
      description: 'Imagem de fundo do hero section',
      bucket: 'cover-hero',
      maxSize: 5 * 1024 * 1024, // 5MB
      acceptedTypes: ['image/png', 'image/jpeg', 'image/webp'],
    },
  };

  const config = imageTypeConfig[imageType];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!config.acceptedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de arquivo não suportado',
        description: `Por favor, selecione um arquivo ${config.acceptedTypes.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    // Validar tamanho
    if (file.size > config.maxSize) {
      toast({
        title: 'Arquivo muito grande',
        description: `O arquivo deve ter no máximo ${config.maxSize / (1024 * 1024)}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imageType', imageType);

      const response = await fetch(`/api/admin/organizations/${organizationId}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Upload realizado com sucesso!',
          description: `${config.label} atualizada com sucesso`,
        });
        
        // Recarregar a página para mostrar a nova imagem
        window.location.reload();
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Erro interno do servidor',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;

    if (!confirm(`Tem certeza que deseja remover a ${config.label.toLowerCase()}?`)) {
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch(`/api/admin/organizations/${organizationId}/remove-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageType }),
      });

      if (!response.ok) {
        throw new Error('Erro ao remover imagem');
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Imagem removida com sucesso!',
          description: `${config.label} removida com sucesso`,
        });
        
        // Recarregar a página
        window.location.reload();
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: 'Erro ao remover imagem',
        description: error instanceof Error ? error.message : 'Erro interno do servidor',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Imagem Atual */}
      <div>
        <h4 className="text-sm font-medium mb-2">Imagem Atual</h4>
        {currentImageUrl ? (
          <div className="relative">
            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
              <img
                src={currentImageUrl}
                alt={config.description}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{config.label} - {organizationName}</DialogTitle>
                    <DialogDescription>
                      Visualização da imagem atual
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img
                      src={currentImageUrl}
                      alt={config.description}
                      className="max-w-full max-h-96 object-contain rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhuma imagem selecionada</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload de Nova Imagem */}
      <div>
        <h4 className="text-sm font-medium mb-2">Upload de Nova Imagem</h4>
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={config.acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Selecionar Arquivo
          </Button>

          {previewUrl && (
            <div className="space-y-3">
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => setPreviewUrl(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {fileInputRef.current?.files?.[0] && (
                <div className="text-xs text-gray-500">
                  <p>Arquivo: {fileInputRef.current.files[0].name}</p>
                  <p>Tamanho: {getFileSize(fileInputRef.current.files[0].size)}</p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fazendo Upload...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Fazer Upload
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Informações */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Formatos aceitos: {config.acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}</p>
        <p>• Tamanho máximo: {getFileSize(config.maxSize)}</p>
        <p>• A imagem será otimizada automaticamente</p>
      </div>
    </div>
  );
}
