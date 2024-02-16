import { IsNumber, IsPositive, IsUUID } from "class-validator";
import { Transform } from 'class-transformer';

export class UpdateItemQuantityDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => +value)
  quantity: number;
  @IsUUID()
  id: string;
}