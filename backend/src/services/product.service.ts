import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error';
import { Prisma } from '@prisma/client';

export class ProductService {
  public static async getProducts(params: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
  }) {
    const { page, limit, category, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = {
        equals: category,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      products,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  public static async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError(`Product with ID ${id} not found`, 404);
    }

    return product;
  }
}
