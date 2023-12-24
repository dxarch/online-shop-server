import { Injectable } from '@nestjs/common';
import { ProductsRepo } from '../domain/repos/products.repo';
import { PaginationQueryDto } from "../domain/dtos/pagination.query.dto";
import { SearchQueryDto } from "./domain/search.query.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepo) {}

  async getAllProducts(paginationQuery: PaginationQueryDto) {
    return await this.productsRepo.getAllProducts(paginationQuery);
  }

  async getProductById(id: string) {
    return await this.productsRepo.getProductById(id);
  }

  async getProductsBySearch(searchQuery: SearchQueryDto) {
    return await this.productsRepo.getProductsBySearch(searchQuery);
  }
}
