// Middlewares
import { sanitizeInput } from '../../shared/middlewares/sanitize-input.middleware.js';

const sanitizedAdminInput = sanitizeInput({
  required: [
    'reservationDate',
    'startDate',
    'plannedEndDate',
    'user',
    'vehicle',
  ],
  date: ['reservationDate', 'startDate', 'plannedEndDate'],
});

const sanitizedUserInput = sanitizeInput({
  required: ['reservationDate', 'startDate', 'plannedEndDate', 'vehicle'],
  date: ['reservationDate', 'startDate', 'plannedEndDate'],
});

const sanitizedUpdateInput = sanitizeInput({
  required: [],
  numeric: ['initialKms', 'finalKms'],
  date: ['realEndDate', 'cancellationDate'],
});

export { sanitizedAdminInput, sanitizedUserInput, sanitizedUpdateInput };
