// Interfaces
import { BrandsResponse } from '@core/brand/interfaces/brands-response.interface';
import { CategoriesResponse } from '@core/category/interfaces/categories-response.interface';

export interface ForkJoinResponse {
  brands: BrandsResponse;
  categories: CategoriesResponse;
}
