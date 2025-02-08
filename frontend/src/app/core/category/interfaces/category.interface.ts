// Interfaces
import { BaseEntity } from '@shared/interfaces/base-entity.interface';
import { CategoryInput } from '@core/category/interfaces/category-input.interface';

export interface Category extends BaseEntity, CategoryInput {}
