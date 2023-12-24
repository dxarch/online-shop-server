import { IsUUID } from 'class-validator';

export class DeleteOrderCartItemsQueryDto {
  @IsUUID()
  order_id: string;
}