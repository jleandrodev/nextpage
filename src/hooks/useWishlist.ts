import { useState, useEffect } from 'react';

interface WishlistItem {
  ebookId: string;
  addedAt: string;
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar lista de desejos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar lista de desejos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar lista de desejos no localStorage
  const saveWishlist = (newWishlist: WishlistItem[]) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    } catch (error) {
      console.error('Erro ao salvar lista de desejos:', error);
    }
  };

  // Adicionar ebook à lista de desejos
  const addToWishlist = (ebookId: string) => {
    const isAlreadyInWishlist = wishlist.some((item) => item.ebookId === ebookId);

    if (!isAlreadyInWishlist) {
      const newItem: WishlistItem = {
        ebookId,
        addedAt: new Date().toISOString(),
      };
      saveWishlist([...wishlist, newItem]);
    }
  };

  // Remover ebook da lista de desejos
  const removeFromWishlist = (ebookId: string) => {
    const newWishlist = wishlist.filter((item) => item.ebookId !== ebookId);
    saveWishlist(newWishlist);
  };

  // Verificar se ebook está na lista de desejos
  const isInWishlist = (ebookId: string) => {
    return wishlist.some((item) => item.ebookId === ebookId);
  };

  // Limpar lista de desejos
  const clearWishlist = () => {
    saveWishlist([]);
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
}
