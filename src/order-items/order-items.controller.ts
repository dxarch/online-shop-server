import { Controller, Patch, UseGuards } from "@nestjs/common";
import { OrderItemsService } from './order-items.service';
import { JwtGuard } from "../libs/security/guards/jwt.guard";

@UseGuards(JwtGuard)
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}
}
