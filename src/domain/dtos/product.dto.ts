import { Prisma, Product } from '@prisma/client';
import { UUIDDto } from './UUID.dto';

export class ProductDto extends UUIDDto {
  id: string;
  title: string;
  image_url: string;
  description: string;
  price: Prisma.Decimal;
  available_amount: number;

  static fromEntity(entity?: Product) {
    if (!entity) {
      return;
    }
    const it = new ProductDto();
    it.id = entity.id;
    it.title = entity.title;
    it.description = entity.description;
    it.price = entity.price;
    it.image_url = entity.image_url;
    it.available_amount = entity.available_amount;
    it.created_at = entity.created_at.valueOf();
    it.updated_at = entity.updated_at.valueOf();
    return it;
  }

  static fromEntities(entities?: Product[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
