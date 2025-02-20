// Middlewares
import { sanitizeInput } from '../../shared/middlewares/sanitize-input.middleware.js';

export const sanitizedInput = sanitizeInput({
  required: [
    'vehicleModelName',
    'transmissionType',
    'passengerCount',
    'imagePath',
    'category',
    'brand',
  ],
  numeric: ['passengerCount', 'category', 'brand'],
  unique: ['vehicleModelName'],
  entity: 'VehicleModel',
});
