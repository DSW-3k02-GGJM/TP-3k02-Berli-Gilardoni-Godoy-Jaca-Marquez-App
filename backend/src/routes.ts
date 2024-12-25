// Routers
import { brandRouter } from './core/brand/brand.routes.js';
import { categoryRouter } from './core/category/category.routes.js';
import { colorRouter } from './core/color/color.routes.js';
import { locationRouter } from './core/location/location.routes.js';
import { reservationRouter } from './core/reservation/reservation.routes.js';
import { userRouter } from './core/user/user.routes.js';
import { vehicleRouter } from './core/vehicle/vehicle.routes.js';
import { vehicleModelRouter } from './core/vehicle-model/vehicle-model.routes.js';
import { uploadRouter } from './upload/upload.routes.js';

export const routes = {
  brands: brandRouter,
  categories: categoryRouter,
  colors: colorRouter,
  locations: locationRouter,
  reservations: reservationRouter,
  users: userRouter,
  vehicles: vehicleRouter,
  'vehicle-models': vehicleModelRouter,
  upload: uploadRouter,
};
