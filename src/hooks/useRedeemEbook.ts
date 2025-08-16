import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedeemEbookParams {
  ebookId: string;
  organizationId: string;
}

interface RedeemEbookResponse {
  success: boolean;
  redemption?: any;
  message?: string;
  error?: string;
}

export function useRedeemEbook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const redeemEbook = async ({ ebookId, organizationId }: RedeemEbookParams): Promise<RedeemEbookResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ebooks/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ebookId, organizationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao resgatar ebook');
      }

      // Atualizar a página para refletir as mudanças
      router.refresh();

      return {
        success: true,
        redemption: data.redemption,
        message: data.message,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao resgatar ebook';
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    redeemEbook,
    loading,
    error,
  };
}
