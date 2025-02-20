// Middlewares
import { sanitizeInput } from '../../shared/middlewares/sanitize-input.middleware.js';

const sanitizedFilterInput = sanitizeInput({
  required: ['startDate', 'endDate', 'location'],
  moveQueryValuesToBody: true,
  numeric: ['location'],
  date: ['startDate', 'endDate'],
  dateRange: { startDate: 'startDate', endDate: 'endDate' },
});

const sanitizedCreateInput = sanitizeInput({
  required: [
    'licensePlate',
    'manufacturingYear',
    'totalKms',
    'location',
    'color',
    'vehicleModel',
  ],
  uppercase: ['licensePlate'],
  numeric: [
    'manufacturingYear',
    'totalKms',
    'location',
    'color',
    'vehicleModel',
  ],
  unique: ['licensePlate'],
  entity: 'Vehicle',
});

const sanitizedUpdateInput = sanitizeInput({
  required: [],
  uppercase: ['licensePlate'],
  numeric: [
    'manufacturingYear',
    'totalKms',
    'location',
    'color',
    'vehicleModel',
  ],
  unique: ['licensePlate'],
  entity: 'Vehicle',
});

export { sanitizedFilterInput, sanitizedCreateInput, sanitizedUpdateInput };
