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
  numeric: ['initialKms'],
  date: ['cancellationDate'],
});

const sanitizedCheckOutInput = sanitizeInput({
  required: ['realEndDate', 'finalKms', 'finalPrice'],
  numeric: ['finalKms', 'finalPrice'],
  date: ['realEndDate'],
});

export {
  sanitizedAdminInput,
  sanitizedUserInput,
  sanitizedUpdateInput,
  sanitizedCheckOutInput,
};
