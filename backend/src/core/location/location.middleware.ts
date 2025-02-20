// Middlewares
import { sanitizeInput } from '../../shared/middlewares/sanitize-input.middleware.js';

export const sanitizedInput = sanitizeInput({
  required: ['locationName', 'address', 'phoneNumber'],
  unique: ['locationName'],
  entity: 'Location',
});
