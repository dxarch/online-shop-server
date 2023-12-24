import { IsNumber, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrderDto {
  @IsUUID()
  order_id: string;
  @IsNumber()
  @Transform(({ value }) => +value)
  quantity: number;
  @IsNumber()
  @Transform(({ value }) => +value)
  price: number;
  @IsUUID()
  product_id: string;

  static fromEntity(entity?: CreateOrderDto) {
    if (!entity) {
      return;
    }
    const it = new CreateOrderDto();
    it.order_id = entity.order_id;
    it.product_id = entity.order_id;
    it.quantity = entity.quantity;
    it.price = entity.price;
    return it;
  }
}