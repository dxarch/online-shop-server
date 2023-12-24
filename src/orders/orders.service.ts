import { Injectable } from '@nestjs/common';
import { Order, OrderItem, OrderStatuses, Prisma, User } from '@prisma/client';
import { OrdersRepo } from '../domain/repos/orders.repo';
import { OrderItemsRepo } from '../domain/repos/order.items.repo';
import { OrderDto } from '../domain/dtos/order.dto';
import { ProductsRepo } from '../domain/repos/products.repo';
import { OrderItemDto } from '../domain/dtos/order-item.dto';
import { AddItemToOrderForm } from '../order-items/domain/add-item-to-order.form';
import { UpdateItemQuantityDto } from '../domain/dtos/update-item-quantity.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepo: OrdersRepo,
    private readonly orderItemRepo: OrderItemsRepo,
    private readonly productRepo: ProductsRepo,
  ) {}

  async createCartOrderForUser(user: User) {
    return await this.orderRepo.createCartForUser(user.id);
  }

  async getProductPrice(product_id: string) {
    return await this.productRepo.getProductPrice(product_id);
  }

  async getCartOrder(user: User) {
    return await this.orderRepo.getCartOrder(user.id);
  }

  async addItemToCartOrder(
    product: AddItemToOrderForm,
    product_price: Prisma.Decimal,
  ) {
    const existingOrderItem = await this.orderItemRepo.getOrderItemByOrderId(
      product.order_id,
    );

    if (existingOrderItem) {
      console.log('order item exists');
      return await this.orderItemRepo.incrementOrderItemQuantityByOrderItemId(
        existingOrderItem.id,
        product.quantity,
      );
    }

    return await this.orderItemRepo.createCartOrderItem(product, product_price);
  }

  async recalculateCartTotal(orderItems: OrderItem[], order_id: string) {
    let total = 0;
    orderItems.map((orderItem: OrderItem) => {
      total += orderItem.quantity * Number(orderItem.price);
    });

    return await this.orderRepo.setCartTotal(order_id, total);
  }

  async updateOrderItemPrices(orderItems: OrderItem[]) {
    const newPrices = await Promise.all(
      orderItems.map((orderItem: OrderItem) => {
        return this.productRepo.getProductPrice(orderItem.product_id);
      }),
    );

    return await Promise.all(
      orderItems.map((orderItem: OrderItem, i) => {
        const { price } = newPrices[i];
        if (orderItem.price !== price) {
          return this.orderItemRepo.updateOrderItemPrice(orderItem.id, price);
        }
      }),
    );
  }

  async clearOrderCart(order: Order) {
    return await this.orderItemRepo.clearOrderCart(order.id);
  }

  async getOrders(user: User) {
    return await this.orderRepo.getOrders(user.id);
  }

  async createOrder(user: User, cart: OrderDto) {
    const result = await Promise.all(
      cart.order_items.map(async (orderItem: OrderItemDto) => {
        const res = await this.productRepo.sellProduct(
          orderItem.product_id,
          orderItem.quantity,
        );
        return res;
      }),
    );

    await this.orderRepo.changeOrderStatus(
      cart.id,
      OrderStatuses.OrderProcessed,
    );
    return result;
  }

  async updateItemQuantity(updateItemQuantityDto: UpdateItemQuantityDto) {
    const { id, quantity } = updateItemQuantityDto;
    return this.orderItemRepo.updateItemQuantity(id, quantity);
  }
}
