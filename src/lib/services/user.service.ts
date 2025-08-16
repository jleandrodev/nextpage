import { prisma } from '@/lib/prisma';
import { CreateUserDTO, UpdateUserDTO, UserWithOrganization } from '@/types/organization';
import bcrypt from 'bcryptjs';

export class UserService {
  // Listar usuários com filtros
  async findAll(filters?: {
    organizationId?: string;
    role?: 'ADMIN_MASTER' | 'CLIENTE';
    isActive?: boolean;
  }): Promise<UserWithOrganization[]> {
    return await prisma.user.findMany({
      where: filters,
      include: {
        organization: true,
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Buscar usuário por ID
  async findById(id: string): Promise<UserWithOrganization | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        organization: true,
        pointsHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        redemptions: {
          include: {
            ebook: true,
          },
          orderBy: { redeemedAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  // Buscar usuário por CPF
  async findByCpf(cpf: string): Promise<UserWithOrganization | null> {
    return await prisma.user.findUnique({
      where: { cpf },
      include: {
        organization: true,
      },
    });
  }

  // Buscar usuário por email
  async findByEmail(email: string): Promise<UserWithOrganization | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    });
  }

  // Criar novo usuário
  async create(data: CreateUserDTO) {
    // Verificar se CPF já existe
    const existingCpf = await this.findByCpf(data.cpf);
    if (existingCpf) {
      throw new Error('CPF já está cadastrado');
    }

    // Verificar se email já existe (se fornecido)
    if (data.email) {
      const existingEmail = await this.findByEmail(data.email);
      if (existingEmail) {
        throw new Error('Email já está cadastrado');
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 12);

    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      include: {
        organization: true,
      },
    });
  }

  // Atualizar usuário
  async update(data: UpdateUserDTO) {
    const { id, ...updateData } = data;

    return await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        organization: true,
      },
    });
  }

  // Atualizar senha
  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        firstAccess: false,
      },
    });
  }

  // Verificar senha
  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return false;
    }

    return await bcrypt.compare(password, user.password);
  }

  // Autenticar usuário
  async authenticate(cpf: string, password: string): Promise<UserWithOrganization | null> {
    const user = await this.findByCpf(cpf);

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  // Adicionar pontos ao usuário
  async addPoints(userId: string, points: number, description: string, pointsImportId?: string) {
    return await prisma.$transaction(async (tx) => {
      // Atualizar pontos do usuário
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: points,
          },
        },
      });

      // Registrar no histórico
      await tx.pointsHistory.create({
        data: {
          userId,
          pointsAdded: points,
          sourceDescription: description,
          pointsImportId,
        },
      });

      return user;
    });
  }

  // Resgatar ebook (debitar pontos) - Apenas para primeiro resgate
  async redeemEbook(userId: string, ebookId: string, organizationId: string, pointsCost = 1) {
    return await prisma.$transaction(async (tx) => {
      // Verificar se usuário tem pontos suficientes
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { points: true },
      });

      if (!user || user.points < pointsCost) {
        throw new Error('Pontos insuficientes');
      }

      // Verificar se já resgatou este ebook
      const existingRedemption = await tx.redemption.findUnique({
        where: {
          userId_ebookId: {
            userId,
            ebookId,
          },
        },
      });

      if (existingRedemption) {
        throw new Error('Ebook já foi resgatado por este usuário');
      }

      // Debitar pontos
      await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            decrement: pointsCost,
          },
        },
      });

      // Criar registro de resgate
      return await tx.redemption.create({
        data: {
          userId,
          ebookId,
          organizationId,
          pointsUsed: pointsCost,
        },
        include: {
          ebook: true,
          user: true,
        },
      });
    });
  }

  // Download ebook (debitar pontos) - Permite downloads múltiplos
  async downloadEbook(userId: string, ebookId: string, organizationId: string, pointsCost = 1) {
    return await prisma.$transaction(async (tx) => {
      // Verificar se usuário tem pontos suficientes
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { points: true },
      });

      if (!user || user.points < pointsCost) {
        throw new Error('Pontos insuficientes');
      }

      // Verificar se já resgatou este ebook
      const existingRedemption = await tx.redemption.findUnique({
        where: {
          userId_ebookId: {
            userId,
            ebookId,
          },
        },
      });

      // Debitar pontos sempre
      await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            decrement: pointsCost,
          },
        },
      });

      // Se não resgatou antes, criar registro de resgate
      if (!existingRedemption) {
        await tx.redemption.create({
          data: {
            userId,
            ebookId,
            organizationId,
            pointsUsed: pointsCost,
          },
        });
      }

      // Retornar sucesso
      return {
        success: true,
        message: 'Download realizado com sucesso',
        pointsUsed: pointsCost,
        newBalance: user.points - pointsCost,
      };
    });
  }

  // Listar resgates do usuário
  async getUserRedemptions(userId: string) {
    return await prisma.redemption.findMany({
      where: { userId },
      include: {
        ebook: true,
      },
      orderBy: {
        redeemedAt: 'desc',
      },
    });
  }

  // Histórico de pontos do usuário
  async getUserPointsHistory(userId: string) {
    return await prisma.pointsHistory.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Ativar/Desativar usuário
  async toggleActive(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });
  }

  // Atualizar perfil do usuário
  async updateProfile(userId: string, data: { name: string; email: string }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o email já está sendo usado por outro usuário
    if (data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error('Este email já está sendo usado por outro usuário');
      }
    }

    return await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.name,
        email: data.email,
      },
    });
  }

  // Criar ou atualizar usuário durante importação de planilha
  async createOrUpdateFromImport(data: {
    cpf: string;
    points: number;
    fullName?: string;
    email?: string;
    organizationId: string;
    pointsImportId: string;
  }) {
    const { cpf, points, fullName, email, organizationId, pointsImportId } = data;

    console.log(`👤 Processando usuário CPF ${cpf} com ${points} pontos`);

    return await prisma.$transaction(async (tx) => {
      // Verificar se usuário já existe
      let user = await tx.user.findUnique({
        where: { cpf },
      });

      if (user) {
        console.log(`🔄 Atualizando usuário existente: ${user.fullName || user.cpf}`);
        console.log(`🏢 Organização atual: ${user.organizationId}, Nova organização: ${organizationId}`);

        // Verificar se o usuário já pertence a uma organização diferente
        if (user.organizationId && user.organizationId !== organizationId) {
          console.log(
            `⚠️ ATENÇÃO: Usuário ${user.cpf} já pertence à organização ${user.organizationId}, mas está sendo importado para ${organizationId}`,
          );
        }

        // Atualizar usuário existente
        user = await tx.user.update({
          where: { cpf },
          data: {
            points: {
              increment: points,
            },
            // Atualizar dados se fornecidos e não existirem
            ...(fullName && !user.fullName && { fullName }),
            ...(email && !user.email && { email }),
            // Associar à organização se não estiver associado
            ...(user.organizationId === null && { organizationId }),
          },
        });
        console.log(`✅ Usuário atualizado. Novos pontos: ${user.points}, Organização: ${user.organizationId}`);
      } else {
        console.log(`🆕 Criando novo usuário: ${fullName || cpf}`);
        // Criar novo usuário
        // Gerar senha temporária baseada no CPF
        const tempPassword = cpf.slice(-6); // Últimos 6 dígitos do CPF
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        user = await tx.user.create({
          data: {
            cpf,
            email,
            fullName,
            password: hashedPassword,
            points,
            organizationId,
            firstAccess: true,
          },
        });
        console.log(`✅ Novo usuário criado com ${user.points} pontos`);
      }

      // Registrar no histórico de pontos
      await tx.pointsHistory.create({
        data: {
          userId: user.id,
          pointsAdded: points,
          sourceDescription: `Importação de planilha`,
          pointsImportId,
        },
      });

      console.log(`📝 Histórico de pontos registrado para usuário ${user.id}`);
      return user;
    });
  }
}
