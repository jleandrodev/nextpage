import { Paddle, PricePreviewParams, PricePreviewResponse } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import { PricingTier } from '@/constants/pricing-tier';

export type PaddlePrices = Record<string, string>;

function getLineItems(): PricePreviewParams['items'] {
  const priceId = PricingTier.map((tier) => [tier.priceId.month, tier.priceId.year]);
  return priceId.flat().map((priceId) => ({ priceId, quantity: 1 }));
}

function getPriceAmounts(prices: PricePreviewResponse) {
  return prices.data.details.lineItems.reduce((acc, item) => {
    acc[item.price.id] = item.formattedTotals.total;
    return acc;
  }, {} as PaddlePrices);
}

// Preços mockados para desenvolvimento local
const mockPrices: PaddlePrices = {
  pri_01hsxyh9txq4rzbrhbyngkhy46: '$9.99',
  pri_01hsxycme6m95sejkz7sbz5e9g: '$19.99',
  pri_01hsxyeb2bmrg618bzwcwvdd6q: '$199.99',
  pri_01hsxyff091kyc9rjzx7zm6yqh: '$39.99',
  pri_01hsxyfysbzf90tkh2wqbfxwa5: '$399.99',
};

export function usePaddlePrices(
  paddle: Paddle | undefined,
  country: string,
): { prices: PaddlePrices; loading: boolean } {
  const [prices, setPrices] = useState<PaddlePrices>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Se não há paddle configurado, usa preços mockados
    if (!paddle || !process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
      setPrices(mockPrices);
      setLoading(false);
      return;
    }

    const paddlePricePreviewRequest: Partial<PricePreviewParams> = {
      items: getLineItems(),
      ...(country !== 'OTHERS' && { address: { countryCode: country } }),
    };

    setLoading(true);

    paddle?.PricePreview(paddlePricePreviewRequest as PricePreviewParams).then((prices) => {
      setPrices((prevState) => ({ ...prevState, ...getPriceAmounts(prices) }));
      setLoading(false);
    });
  }, [country, paddle]);
  return { prices, loading };
}
