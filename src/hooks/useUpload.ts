import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UploadOptions {
  type: 'logo' | 'login-image' | 'ebook-cover' | 'ebook-file' | 'spreadsheet';
  id: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, options: UploadOptions) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', options.type);
      formData.append('id', options.id);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro no upload');
      }

      const { url } = await response.json();

      toast({
        title: 'Upload realizado com sucesso!',
        description: 'Arquivo enviado com sucesso.',
      });

      options.onSuccess?.(url);
      return url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      toast({
        title: 'Erro no upload',
        description: errorMessage,
        variant: 'destructive',
      });

      options.onError?.(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (bucket: string, fileName: string) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bucket, fileName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar arquivo');
      }

      toast({
        title: 'Arquivo deletado com sucesso!',
        description: 'Arquivo removido do storage.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      toast({
        title: 'Erro ao deletar arquivo',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
  };
}
