import Image from 'next/image';
import Link from 'next/link';
import { CountryDropdown } from '@/components/home/header/country-dropdown';
import { ArrowUpRight, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  country: string;
  onCountryChange: (value: string) => void;
}
export function LocalizationBanner({ country, onCountryChange }: Props) {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) {
    return null;
  }

  return (
    <div className={'hidden md:flex border-border/50 border-b-2 bg-gradient-to-r from-blue-50 to-purple-50'}>
      <div className={'flex flex-1 justify-center items-center p-2 gap-8'}>
        <div className={'flex items-center gap-4'}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <p className={'text-[16px] font-medium text-center'}>
            🎉 <strong>Promoção Especial:</strong> 100 pontos de bônus para novos usuários!
          </p>
          <Link className={'text-[16px] text-blue-600 hover:text-blue-800'} href={'/signup'}>
            <span className={'flex items-center gap-1'}>
              Criar conta grátis
              <ArrowUpRight className={'h-4 w-4'} />
            </span>
          </Link>
        </div>
        <div className={'flex items-center gap-4'}>
          <CountryDropdown country={country} onCountryChange={onCountryChange} />
          <X size={'16'} className={'cursor-pointer'} onClick={() => setShowBanner(false)} />
        </div>
      </div>
    </div>
  );
}
