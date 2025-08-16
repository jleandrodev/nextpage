import { prisma } from '@/lib/prisma';
import { Ebook } from '@prisma/client';

export class EbookService {
  async findAll(): Promise<Ebook[]> {
    return await prisma.ebook.findMany({
      where: { isActive: true },
      orderBy: { title: 'asc' },
    });
  }

  async findById(id: string): Promise<Ebook | null> {
    return await prisma.ebook.findUnique({
      where: { id },
    });
  }

  async findByOrganization(organizationSlug: string): Promise<Ebook[]> {
    return await prisma.ebook.findMany({
      where: {
        isActive: true,
        OR: [
          { organizationId: null }, // Ebooks globais
          {
            organization: {
              slug: organizationSlug,
              isActive: true,
            },
          },
        ],
      },
      orderBy: { title: 'asc' },
    });
  }

  async create(data: {
    title: string;
    author: string;
    description?: string;
    category?: string;
    coverImageUrl?: string;
    ebookFileUrl?: string;
    pointsCost?: number;
    organizationId?: string;
  }): Promise<Ebook> {
    return await prisma.ebook.create({
      data: {
        ...data,
        pointsCost: data.pointsCost || 1,
      },
    });
  }

  async update(id: string, data: Partial<Ebook>): Promise<Ebook> {
    return await prisma.ebook.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Ebook> {
    return await prisma.ebook.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
