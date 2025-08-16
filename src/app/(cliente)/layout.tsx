'use client';

import { ClienteHeader } from '@/components/cliente/layout/cliente-header';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <ClienteHeader />
      <main className="bg-white">{children}</main>
    </div>
  );
}
