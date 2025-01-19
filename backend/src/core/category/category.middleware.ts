// Middlewares
import { sanitizeInput } from '../../shared/middlewares/sanitize-input.middleware.js';

export const sanitizedInput = sanitizeInput({
  required: [
    'categoryName',
    'categoryDescription',
    'pricePerDay',
    'depositValue',
  ],
  numeric: ['pricePerDay', 'depositValue'],
  unique: ['categoryName'],
  entity: 'Category',
});
