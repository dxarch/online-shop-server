import { PrismaService } from '../../libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { OrderItem, Prisma } from '@prisma/client';

@Injectable()
export class OrderItemsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getOrderItemByOrderId(id: string) {
    return this.prisma.orderItem.findFirst({
      where: {
        order_id: id,
      },
    });
  }

  async incrementOrderItemQuantityByOrderItemId(
    id: string,
    incrementBy: number,
  ) {
    return this.prisma.orderItem.update({
      where: {
        id,
      },
      data: {
        quantity: {
          increment: incrementBy,
        },
      },
    });
  }

  async createCartOrderItem(
    product: Pick<OrderItem, 'quantity' | 'product_id' | 'order_id'>,
    product_price: Prisma.Decimal,
  ) {
    return this.prisma.orderItem.create({
      data: {
        quantity: product.quantity,
        price: product_price,
        order_id: product.order_id,
        product_id: product.product_id,
      },
    });
  }

  async clearOrderCart(order_id: string) {
    return this.prisma.orderItem.deleteMany({
      where: {
        order_id: order_id,
      },
    });
  }

  async updateOrderItemPrice(id: string, price: Prisma.Decimal) {
    return this.prisma.orderItem.update({
      where: { id },
      data: {
        price: price,
      },
    });
  }

  async updateItemQuantity(id: string, quantity: number) {
    return this.prisma.orderItem.update({
      where: { id },
      data: {
        quantity: quantity,
      },
    });
  }
}
