import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface BatchUploadOptions {
  defaultPoints?: number;
  defaultCategory?: string;
  onProgress?: (progress: number) => void;
  onComplete?: (results: any) => void;
  onError?: (error: string) => void;
}

interface UploadResult {
  fileName: string;
  title: string;
  coverUrl?: string;
  fileUrl?: string;
  success: boolean;
  error?: string;
}

interface BatchUploadResponse {
  success: boolean;
  message: string;
  results: UploadResult[];
  summary: {
    total: number;
    success: number;
    errors: number;
  };
}

export function useBatchUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BatchUploadResponse | null>(null);

  const uploadBatch = async (zipFile: File, options: BatchUploadOptions = {}) => {
    setIsUploading(true);
    setProgress(0);
    setResults(null);

    try {
      // Simular progresso inicial
      options.onProgress?.(10);
      setProgress(10);

      const formData = new FormData();
      formData.append('zipFile', zipFile);
      formData.append('defaultPoints', (options.defaultPoints || 1).toString());
      formData.append('defaultCategory', options.defaultCategory || 'Geral');

      // Simular progresso de upload
      options.onProgress?.(30);
      setProgress(30);

      const response = await fetch('/api/upload-ebooks-batch', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro no upload em lote');
      }

      // Simular progresso de processamento
      options.onProgress?.(80);
      setProgress(80);

      const result: BatchUploadResponse = await response.json();

      // Progresso final
      options.onProgress?.(100);
      setProgress(100);

      setResults(result);

      // Mostrar toast de sucesso
      toast({
        title: 'Upload em lote concluído!',
        description: `${result.summary.success} ebooks processados com sucesso. ${result.summary.errors} erros.`,
      });

      options.onComplete?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      toast({
        title: 'Erro no upload em lote',
        description: errorMessage,
        variant: 'destructive',
      });

      options.onError?.(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setProgress(0);
    setResults(null);
  };

  return {
    uploadBatch,
    isUploading,
    progress,
    results,
    reset,
  };
}
