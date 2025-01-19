// Middlewares
import { sanitizeInput } from '../../shared/middlewares/sanitize-input.middleware.js';

export const sanitizedInput = sanitizeInput({
  required: ['colorName'],
  unique: ['colorName'],
  entity: 'Color',
});
