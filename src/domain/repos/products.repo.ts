import { PrismaService } from '../../libs/prisma/prisma.service';
import { PaginationQueryDto } from '../dtos/pagination.query.dto';
import { Injectable } from '@nestjs/common';
import { SearchQueryDto } from '../../products/domain/search.query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    return this.prisma.product.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
  }

  async getProductById(id: string) {
    return this.prisma.product.findFirst({
      where: { id },
    });
  }

  async getProductPrice(id: string) {
    return this.prisma.product.findFirst({
      where: { id },
      select: {
        price: true,
      },
    });
  }

  async getProductsBySearch(searchQuery: SearchQueryDto) {
    return this.prisma.product.findMany({
      where: {
        title: {
          contains: searchQuery.query,
        },
      },
    });
  }

  async getAvailableAmount(id: string) {
    return this.prisma.product.findFirst({
      where: { id },
      select: {
        available_amount: true,
      },
    });
  }

  async sellProduct(id: string, quantity: number) {
    return this.prisma.$transaction(
      async () => {
        const { available_amount } = await this.getAvailableAmount(id);

        if (quantity > available_amount) {
          throw new Error(
            'Product with this quantity is not available for order!',
          );
        }

        return await this.prisma.product.update({
          where: {
            id,
          },
          data: {
            available_amount: {
              decrement: quantity,
            },
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
  }
}
