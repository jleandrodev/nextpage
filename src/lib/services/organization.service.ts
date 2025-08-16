import { prisma } from '@/lib/prisma';
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  OrganizationWithUsers,
  OrganizationWithDetails,
} from '@/types/organization';
import { Prisma } from '@prisma/client';

export class OrganizationService {
  // Listar todas as organizações
  async findAll(): Promise<OrganizationWithUsers[]> {
    return await prisma.organization.findMany({
      include: {
        users: true,
        _count: {
          select: {
            users: true,
            ebooks: true,
            redemptions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Buscar organização por ID
  async findById(id: string): Promise<OrganizationWithDetails | null> {
    return await prisma.organization.findUnique({
      where: { id },
      include: {
        users: true,
        pointsImports: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        ebooks: true,
        redemptions: {
          include: {
            user: true,
            ebook: true,
          },
          orderBy: { redeemedAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  // Buscar organização por slug (para rotas white label)
  async findBySlug(slug: string) {
    return await prisma.organization.findUnique({
      where: { slug },
    });
  }

  // Buscar organização por CNPJ
  async findByCnpj(cnpj: string) {
    return await prisma.organization.findUnique({
      where: { cnpj },
    });
  }

  // Criar nova organização
  async create(data: CreateOrganizationDTO) {
    // Verificar se slug já existe
    const existingSlug = await this.findBySlug(data.slug);
    if (existingSlug) {
      throw new Error('Slug já está em uso');
    }

    // Verificar se CNPJ já existe
    const existingCnpj = await this.findByCnpj(data.cnpj);
    if (existingCnpj) {
      throw new Error('CNPJ já está cadastrado');
    }

    return await prisma.organization.create({
      data,
      include: {
        users: true,
      },
    });
  }

  // Atualizar organização
  async update(data: UpdateOrganizationDTO) {
    const { id, ...updateData } = data;

    // Se estiver atualizando slug, verificar se não existe
    if (updateData.slug) {
      const existingSlug = await prisma.organization.findUnique({
        where: {
          slug: updateData.slug,
          NOT: { id },
        },
      });
      if (existingSlug) {
        throw new Error('Slug já está em uso');
      }
    }

    // Se estiver atualizando CNPJ, verificar se não existe
    if (updateData.cnpj) {
      const existingCnpj = await prisma.organization.findUnique({
        where: {
          cnpj: updateData.cnpj,
          NOT: { id },
        },
      });
      if (existingCnpj) {
        throw new Error('CNPJ já está cadastrado');
      }
    }

    return await prisma.organization.update({
      where: { id },
      data: updateData,
      include: {
        users: true,
      },
    });
  }

  // Ativar/Desativar organização
  async toggleActive(id: string) {
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!organization) {
      throw new Error('Organização não encontrada');
    }

    return await prisma.organization.update({
      where: { id },
      data: { isActive: !organization.isActive },
    });
  }

  // Deletar organização (soft delete - apenas desativa)
  async delete(id: string) {
    return await this.toggleActive(id);
  }

  // Verificar se slug está disponível
  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const where: Prisma.OrganizationWhereInput = { slug };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const existing = await prisma.organization.findUnique({ where });
    return !existing;
  }

  // Gerar slug único baseado no nome
  async generateSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplos
      .trim();

    let slug = baseSlug;
    let counter = 1;

    while (!(await this.isSlugAvailable(slug))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  // Estatísticas da organização
  async getStats(organizationId: string) {
    const [users, ebooks, redemptions, totalPoints] = await Promise.all([
      prisma.user.count({
        where: { organizationId },
      }),
      prisma.ebook.count({
        where: { organizationId },
      }),
      prisma.redemption.count({
        where: { organizationId },
      }),
      prisma.user.aggregate({
        where: { organizationId },
        _sum: { points: true },
      }),
    ]);

    return {
      totalUsers: users,
      totalEbooks: ebooks,
      totalRedemptions: redemptions,
      totalPoints: totalPoints._sum.points || 0,
    };
  }

  // Ebooks mais resgatados de uma organização
  async getTopEbooks(organizationId: string, limit = 5) {
    const result = await prisma.ebook.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: { redemptions: true },
        },
      },
      orderBy: {
        redemptions: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return result.map((ebook) => ({
      ...ebook,
      redemptionCount: ebook._count.redemptions,
    }));
  }
}
