'use server';

import { UserService } from '@/lib/services/user.service';
import { OrganizationService } from '@/lib/services/organization.service';
import { revalidatePath } from 'next/cache';

interface UpdatePasswordDTO {
  cpf: string;
  password: string;
  organizationSlug: string;
}

export async function updatePasswordAction(data: UpdatePasswordDTO) {
  try {
    const userService = new UserService();
    const organizationService = new OrganizationService();

    // Verificar se a organização existe
    const organization = await organizationService.findBySlug(data.organizationSlug);
    if (!organization || !organization.isActive) {
      return {
        success: false,
        error: 'Organização não encontrada ou inativa.',
      };
    }

    // Buscar usuário
    const user = await userService.findByCpf(data.cpf);
    if (!user) {
      return {
        success: false,
        error: 'Usuário não encontrado.',
      };
    }

    // Verificar se o usuário pertence à organização
    if (user.organizationId !== organization.id) {
      return {
        success: false,
        error: 'Usuário não pertence a esta organização.',
      };
    }

    // Verificar se é primeiro acesso
    if (!user.firstAccess) {
      return {
        success: false,
        error: 'Este usuário já possui senha definida.',
      };
    }

    // Atualizar senha
    await userService.updatePassword(user.id, data.password);

    revalidatePath(`/${data.organizationSlug}/login`);

    return {
      success: true,
      message: 'Senha atualizada com sucesso.',
    };
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return {
      success: false,
      error: 'Erro interno do servidor.',
    };
  }
}
