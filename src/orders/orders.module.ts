import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../libs/prisma/prisma.module';
import { OrdersRepo } from '../domain/repos/orders.repo';
import { OrderItemsRepo } from '../domain/repos/order.items.repo';
import { ProductsRepo } from '../domain/repos/products.repo';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepo, OrderItemsRepo, ProductsRepo],
  exports: [OrdersService],
})
export class OrdersModule {}
