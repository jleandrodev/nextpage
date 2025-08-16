import { useState, useEffect } from 'react';

interface Redemption {
  id: string;
  userId: string;
  ebookId: string;
  organizationId: string;
  pointsUsed: number;
  redeemedAt: string;
  ebook: {
    id: string;
    title: string;
    author: string;
    description: string | null;
    category: string | null;
    coverImageUrl: string | null;
    ebookFileUrl: string | null;
    pointsCost: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export function useUserRedemptions() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user/redemptions');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar resgates');
      }

      setRedemptions(data.redemptions);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao buscar resgates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  return {
    redemptions,
    loading,
    error,
    refetch: fetchRedemptions,
  };
}
