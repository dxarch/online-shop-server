import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsRepo } from '../domain/repos/order.items.repo';
import { PrismaModule } from '../libs/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, OrderItemsService, OrderItemsRepo],
})
export class OrderItemsModule {}
