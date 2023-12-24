import { Order, OrderItem, OrderStatuses, Prisma } from "@prisma/client";
import { UUIDDto } from './UUID.dto';
import { OrderItemDto } from './order-item.dto';

export class OrderDto extends UUIDDto {
  total?: Prisma.Decimal;
  order_items: OrderItemDto[];
  status: OrderStatuses;

  static fromEntity(entity?: Order & { order_items?: OrderItem[] }) {
    console.log(entity);
    if (!entity) {
      return;
    }
    const it = new OrderDto();
    it.id = entity.id;
    it.order_items = OrderItemDto.fromEntities(entity.order_items);
    it.total = entity?.total;
    it.status = entity.status;

    console.log(it);
    return it;
  }
}
