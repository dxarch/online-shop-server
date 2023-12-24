import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser, JwtGuard } from '../libs/security/guards/jwt.guard';
import { User } from '@prisma/client';
import { AddItemToOrderForm } from '../order-items/domain/add-item-to-order.form';
import { OrderDto } from '../domain/dtos/order.dto';
import { UpdateItemQuantityDto } from '../domain/dtos/update-item-quantity.dto';

/* TODO:
 *   - improve types logic, make return types
 *   - remove extra fields like created_at, extra ids
 *   - !! update order item quantity by order id and product id
 *   - restructure domain folders: move some types to root level, some to local
 *   - add exception handling
 *   - !! figure out why prisma commits unsuccessful transactions
 */

@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/order-item')
  async addItemToOrder(
    @CurrentUser() user: User,
    @Body() product: AddItemToOrderForm, //rename form to dto
  ) {
    const { price } = await this.ordersService.getProductPrice(
      product.product_id,
    );

    const entity = await this.ordersService.addItemToCartOrder(product, price);

    return AddItemToOrderForm.fromEntity(entity);
  }

  @Get('/cart')
  async getOrderCart(@CurrentUser() user: User) {
    const orderCart = await this.ordersService.getCartOrder(user);
    const orderItems = orderCart.order_items;

    const updatePriceResult =
      await this.ordersService.updateOrderItemPrices(orderItems);

    return await this.ordersService.recalculateCartTotal(
      updatePriceResult,
      orderCart.id,
    );
  }

  @Delete('/cart')
  async clearOrderCart(@CurrentUser() user: User) {
    let cart = await this.ordersService.getCartOrder(user);
    await this.ordersService.clearOrderCart(cart);
    cart = await this.ordersService.getCartOrder(user);
    return await this.ordersService.recalculateCartTotal(
      cart.order_items,
      cart.id,
    );
  }

  @Get()
  async getOrders(@CurrentUser() user: User) {
    return await this.ordersService.getOrders(user);
  }

  @Post('/create')
  async createOrder(@CurrentUser() user: User) {
    const entity = await this.ordersService.getCartOrder(user);

    // add validation for empty cart

    const cart = OrderDto.fromEntity(entity);

    const createdOrder = await this.ordersService.createOrder(user, cart);
    await this.ordersService.createCartOrderForUser(user);

    return createdOrder;
  }

  @Patch('/quantity')
  async updateItemQuantity(
    @Body() updateItemQuantityDto: UpdateItemQuantityDto,
  ) {
    return this.ordersService.updateItemQuantity(updateItemQuantityDto);
  }
}
