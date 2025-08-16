import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationService } from '@/lib/services/organization.service';
import { OrganizationsTable } from '@/components/admin/lojistas/organizations-table';

export default async function LojistasPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lojistas</h1>
          <p className="text-muted-foreground">Gerencie as organizações de lojistas do seu sistema white label</p>
        </div>
        <Link href="/admin/lojistas/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lojista
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Lojistas</CardTitle>
          <CardDescription>Visualize e gerencie todas as organizações cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando lojistas...</div>}>
            <OrganizationsTableWrapper />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function OrganizationsTableWrapper() {
  const organizationService = new OrganizationService();
  const organizations = await organizationService.findAll();

  return <OrganizationsTable organizations={organizations} />;
}
