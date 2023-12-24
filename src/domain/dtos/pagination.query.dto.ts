import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  pageSize: number;
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  pageNumber: number;
}
