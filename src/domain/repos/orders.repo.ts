import { PrismaService } from '../../libs/prisma/prisma.service';
import { OrderStatuses } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersRepo {
  constructor(private readonly prisma: PrismaService) {}

  async createCartForUser(id: string) {
    return this.prisma.order.create({
      data: {
        user: {
          connect: {
            id,
          },
        },
        status: OrderStatuses.OrderInCart,
        total: 0,
      },
    });
  }

  async getCartOrder(id: string) {
    return this.prisma.order.findFirst({
      where: {
        user_id: id,
        status: OrderStatuses.OrderInCart,
      },
      include: {
        order_items: true,
      },
    });
  }

  async getCartOrderByUserId(id: string) {
    return this.prisma.order.findFirst({
      where: {
        user_id: id,
        status: OrderStatuses.OrderInCart,
      },
      include: {
        order_items: true,
      },
    });
  }

  async setCartTotal(order_id: string, newTotal: number) {
    return this.prisma.order.update({
      where: {
        id: order_id,
        status: OrderStatuses.OrderInCart,
      },
      data: {
        total: newTotal,
      },
      include: {
        order_items: true,
      },
    });
  }

  async getOrders(id: string) {
    return this.prisma.order.findMany({
      where: {
        user_id: id,
        status: OrderStatuses.OrderProcessed || OrderStatuses.OrderCancelled,
      },
      include: {
        order_items: true,
      },
    });
  }

  async changeOrderStatus(id: string, status: OrderStatuses) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }
}
