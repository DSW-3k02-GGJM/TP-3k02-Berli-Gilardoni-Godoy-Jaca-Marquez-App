// Interfaces
import { BaseEntity } from '@shared/interfaces/base-entity.interface';
import { UserInput } from '@core/user/interfaces/user-input.interface';

export interface User extends BaseEntity, UserInput {}
