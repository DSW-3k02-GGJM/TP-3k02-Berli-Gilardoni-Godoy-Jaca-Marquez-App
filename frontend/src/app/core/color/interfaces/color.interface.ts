// Interfaces
import { BaseEntity } from '@shared/interfaces/base-entity.interface';
import { ColorInput } from '@core/color/interfaces/color-input.interface';

export interface Color extends BaseEntity, ColorInput {}
