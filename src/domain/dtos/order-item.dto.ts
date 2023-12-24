import { OrderItem, Prisma } from '@prisma/client';
import { UUIDDto } from './UUID.dto';

export class OrderItemDto extends UUIDDto {
  quantity: number;
  price: Prisma.Decimal;
  order_id: string;
  product_id: string;

  static fromEntity(entity?: OrderItem) {
    if (!entity) {
      return;
    }

    const it = new OrderItemDto();
    it.id = entity.id;
    it.quantity = entity.quantity;
    it.created_at = entity.created_at.valueOf();
    it.updated_at = entity.updated_at.valueOf();
    it.order_id = entity.order_id;
    it.product_id = entity.product_id;
    it.price = entity.price;

    return it;
  }

  static fromEntities(entities?: OrderItem[]) {
    if (!entities.length) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
