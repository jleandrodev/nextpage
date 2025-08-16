'use server';

import { revalidatePath } from 'next/cache';
import { OrganizationService } from '@/lib/services/organization.service';
import { CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/organization';

const organizationService = new OrganizationService();

// Criar nova organização
export async function createOrganizationAction(data: CreateOrganizationDTO) {
  try {
    const organization = await organizationService.create(data);

    revalidatePath('/admin/lojistas');

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    console.error('Erro ao criar organização:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
}

// Atualizar organização
export async function updateOrganizationAction(data: UpdateOrganizationDTO) {
  try {
    const organization = await organizationService.update(data);

    revalidatePath('/admin/lojistas');
    revalidatePath(`/admin/lojistas/${data.id}`);

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    console.error('Erro ao atualizar organização:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
}

// Ativar/Desativar organização
export async function toggleOrganizationActiveAction(id: string) {
  try {
    const organization = await organizationService.toggleActive(id);

    revalidatePath('/admin/lojistas');
    revalidatePath(`/admin/lojistas/${id}`);

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    console.error('Erro ao alterar status da organização:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
}

// Verificar disponibilidade de slug
export async function checkSlugAvailabilityAction(slug: string, excludeId?: string) {
  try {
    const isAvailable = await organizationService.isSlugAvailable(slug, excludeId);

    return {
      success: true,
      available: isAvailable,
    };
  } catch (error) {
    console.error('Erro ao verificar slug:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
}

// Gerar slug único
export async function generateSlugAction(name: string) {
  try {
    const slug = await organizationService.generateSlug(name);

    return {
      success: true,
      slug,
    };
  } catch (error) {
    console.error('Erro ao gerar slug:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
}

// Obter estatísticas da organização
export async function getOrganizationStatsAction(organizationId: string) {
  try {
    const stats = await organizationService.getStats(organizationId);

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
}

// Obter ebooks mais resgatados
export async function getTopEbooksAction(organizationId: string, limit = 5) {
  try {
    const topEbooks = await organizationService.getTopEbooks(organizationId, limit);

    return {
      success: true,
      data: topEbooks,
    };
  } catch (error) {
    console.error('Erro ao obter top ebooks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
}
