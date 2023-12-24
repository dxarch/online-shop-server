import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PaginationQueryDto } from '../domain/dtos/pagination.query.dto';
import { ProductDto } from '../domain/dtos/product.dto';
import { SearchQueryDto } from './domain/search.query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(@Query() paginationQuery: PaginationQueryDto) {
    const entities = await this.productsService.getAllProducts(paginationQuery);
    return ProductDto.fromEntities(entities);
  }

  @Get('/search')
  async getProductBySearch(@Query() searchQuery: SearchQueryDto) {
    console.log(searchQuery.query);
    return await this.productsService.getProductsBySearch(searchQuery);
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    return await this.productsService.getProductById(id);
  }
}
