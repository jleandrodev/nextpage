'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Eye, Upload, ToggleLeft, ToggleRight, Image } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { OrganizationWithUsers } from '@/types/organization';
import { toggleOrganizationActiveAction } from '@/app/actions/organization.actions';
import { toast } from '@/components/ui/use-toast';

interface OrganizationsTableProps {
  organizations: OrganizationWithUsers[];
}

export function OrganizationsTable({ organizations: initialOrganizations }: OrganizationsTableProps) {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);

  const handleToggleActive = async (id: string) => {
    setLoadingToggle(id);

    try {
      const result = await toggleOrganizationActiveAction(id);

      if (result.success) {
        // Atualizar estado local
        setOrganizations((prev) => prev.map((org) => (org.id === id ? { ...org, isActive: !org.isActive } : org)));

        toast({
          title: 'Sucesso!',
          description: result.data?.isActive ? 'Lojista ativado com sucesso' : 'Lojista desativado com sucesso',
        });
      } else {
        toast({
          title: 'Erro',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro interno do servidor',
        variant: 'destructive',
      });
    } finally {
      setLoadingToggle(null);
    }
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Usuários</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <p className="text-muted-foreground">Nenhum lojista cadastrado</p>
                <Link href="/admin/lojistas/novo" className="text-primary hover:underline">
                  Criar primeiro lojista
                </Link>
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((organization) => (
              <TableRow key={organization.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {organization.logoUrl && (
                      <img
                        src={organization.logoUrl}
                        alt={`Logo ${organization.name}`}
                        className="w-8 h-8 object-contain rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium">{organization.name}</div>
                      <div className="text-sm text-muted-foreground">dominio.com/{organization.slug}/login</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{formatCNPJ(organization.cnpj)}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-muted rounded text-sm">{organization.slug}</code>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{organization._count?.users || 0} usuários</div>
                </TableCell>
                <TableCell>
                  <Badge variant={organization.isActive ? 'default' : 'secondary'}>
                    {organization.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(organization.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>

                      <Link href={`/admin/lojistas/${organization.id}`}>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                      </Link>

                                             <Link href={`/admin/lojistas/${organization.id}/editar`}>
                         <DropdownMenuItem>
                           <Edit className="mr-2 h-4 w-4" />
                           Editar
                         </DropdownMenuItem>
                       </Link>

                      <Link href={`/admin/lojistas/${organization.id}/planilha`}>
                        <DropdownMenuItem>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload planilha
                        </DropdownMenuItem>
                      </Link>

                                             <Link href={`/admin/lojistas/${organization.id}/imagens`}>
                         <DropdownMenuItem>
                           <Image className="mr-2 h-4 w-4" />
                           Gerenciar Imagens
                         </DropdownMenuItem>
                       </Link>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => handleToggleActive(organization.id)}
                        disabled={loadingToggle === organization.id}
                      >
                        {organization.isActive ? (
                          <>
                            <ToggleLeft className="mr-2 h-4 w-4" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <ToggleRight className="mr-2 h-4 w-4" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
