'use client';

import { Separator } from '@/components/ui/separator';
import { LogOut, User } from 'lucide-react';

export function SidebarUserInfo() {
  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    // Mock logout - redirecionar para home
    window.location.href = '/';
  }

  return (
    <div className={'flex flex-col items-start pb-8 px-2 text-sm font-medium lg:px-4'}>
      <Separator className={'relative mt-6 dashboard-sidebar-highlight bg-[#283031]'} />
      <div className={'flex w-full flex-row mt-6 items-center justify-between'}>
        <div className={'flex items-center gap-2 flex-1'}>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className={'flex flex-col items-start justify-center overflow-hidden text-ellipsis'}>
            <div className={'text-sm leading-5 font-semibold w-full overflow-hidden text-ellipsis'}>João Silva</div>
            <div className={'text-sm leading-5 text-muted-foreground w-full overflow-hidden text-ellipsis'}>
              Cliente
            </div>
          </div>
        </div>
        <div>
          <LogOut onClick={handleLogout} className={'h-6 w-6 text-muted-foreground cursor-pointer'} />
        </div>
      </div>
    </div>
  );
}
