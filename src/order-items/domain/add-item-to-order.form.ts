import { IsNumber, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderItem } from '@prisma/client';
import { UUIDDto } from '../../domain/dtos/UUID.dto';

export class AddItemToOrderForm extends UUIDDto {
  @IsNumber()
  @Transform(({ value }) => +value)
  quantity: number;
  @IsUUID()
  product_id: string;
  @IsUUID()
  order_id: string;

  static fromEntity(entity?: OrderItem) {
    if (!entity) {
      return;
    }
    const it = new AddItemToOrderForm();
    it.id = entity.id;
    it.order_id = entity.order_id;
    it.product_id = entity.order_id;
    it.created_at = entity.created_at.valueOf();
    it.updated_at = entity.updated_at.valueOf();
    it.quantity = entity.quantity;
    return it;
  }

  static fromEntities(entities?: OrderItem[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
