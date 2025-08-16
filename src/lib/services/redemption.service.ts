import { prisma } from '@/lib/prisma';
import { Redemption } from '@prisma/client';

export class RedemptionService {
  async findByUser(userId: string): Promise<(Redemption & { ebook: { title: string } })[]> {
    return await prisma.redemption.findMany({
      where: { userId },
      include: {
        ebook: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  async findByOrganization(organizationId: string): Promise<Redemption[]> {
    return await prisma.redemption.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            fullName: true,
            cpf: true,
          },
        },
        ebook: {
          select: {
            title: true,
            author: true,
          },
        },
      },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  async create(data: {
    userId: string;
    ebookId: string;
    organizationId: string;
    pointsUsed?: number;
  }): Promise<Redemption> {
    return await prisma.redemption.create({
      data: {
        ...data,
        pointsUsed: data.pointsUsed || 1,
      },
    });
  }

  async findById(id: string): Promise<Redemption | null> {
    return await prisma.redemption.findUnique({
      where: { id },
      include: {
        user: true,
        ebook: true,
        organization: true,
      },
    });
  }

  async getStats(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};

    const totalRedemptions = await prisma.redemption.count({ where });
    const totalPointsUsed = await prisma.redemption.aggregate({
      where,
      _sum: { pointsUsed: true },
    });

    return {
      totalRedemptions,
      totalPointsUsed: totalPointsUsed._sum.pointsUsed || 0,
    };
  }
}
