// Angular
import { Routes } from '@angular/router';

// Brand
import { BrandsComponent } from '@core/brand/components/brands/brands.component';
import { BrandFormComponent } from '@core/brand/components/brand-form/brand-form.component';

// Category
import { CategoriesComponent } from '@core/category/components/categories/categories.component';
import { CategoryFormComponent } from '@core/category/components/category-form/category-form.component';

// Color
import { ColorsComponent } from '@core/color/components/colors/colors.component';
import { ColorFormComponent } from '@core/color/components/color-form/color-form.component';

// Location
import { LocationsComponent } from '@core/location/components/locations/locations.component';
import { LocationFormComponent } from '@core/location/components/location-form/location-form.component';

// Reservation
import { ReservationsComponent } from '@core/reservation/components/reservations/reservations.component';
import { ReservationsClientComponent } from '@core/reservation/components/reservations-client/reservations-client.component';
import { ReservationFormComponent } from '@core/reservation/components/reservation-form/reservation-form.component';
import { ReservationStepperComponent } from '@core/reservation/components/reservation-stepper/reservation-stepper.component';

// User
import { CommunicationByEmailComponent } from '@core/user/components/communication-by-email/communication-by-email.component';
import { EmailVerificationComponent } from '@core/user/components/email-verification/email-verification.component';
import { ForgotPasswordComponent } from '@core/user/components/forgot-password/forgot-password.component';
import { LoginComponent } from '@core/user/components/login/login.component';
import { ProfileComponent } from '@core/user/components/profile/profile.component';
import { RegisterComponent } from '@core/user/components/register/register.component';
import { ResetPasswordComponent } from '@core/user/components/reset-password/reset-password.component';
import { UsersComponent } from '@core/user/components/users/users.component';
import { UserFormComponent } from '@core/user/components/user-form/user-form.component';

// Vehicle
import { VehiclesComponent } from '@core/vehicle/components/vehicles/vehicles.component';
import { VehicleFormComponent } from '@core/vehicle/components/vehicle-form/vehicle-form.component';

// Vehicle Model
import { VehicleModelsComponent } from '@core/vehicle-model/components/vehicle-models/vehicle-models.component';
import { VehicleModelFormComponent } from '@core/vehicle-model/components/vehicle-model-form/vehicle-model-form.component';

// Pages
import { HomePageComponent } from '@pages/home/home.component';
import { StaffMenuComponent } from '@pages/staff/components/staff-menu/staff-menu.component';

// Guards
import { roleGuard } from '@security/guards/role.guard';

export const routes: Routes = [
  // Home-Page
  { path: 'home', component: HomePageComponent },

  // Authentication
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: null },
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: null },
  },
  {
    path: 'verify-email/:token',
    component: EmailVerificationComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: null },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: null },
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: null },
  },

  // Staff and Administration
  {
    path: 'staff',
    component: StaffMenuComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['admin', 'employee'] },
    children: [
      // Brands
      {
        path: 'brands',
        component: BrandsComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'brands/create',
        component: BrandFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'brands/:id',
        component: BrandFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },

      // Colors
      {
        path: 'colors',
        component: ColorsComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'colors/create',
        component: ColorFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'colors/:id',
        component: ColorFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },

      // Categories
      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'categories/create',
        component: CategoryFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'categories/:id',
        component: CategoryFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },

      // Locations
      {
        path: 'locations',
        component: LocationsComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'locations/create',
        component: LocationFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'locations/:id',
        component: LocationFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },

      // Reservations
      {
        path: 'reservations',
        component: ReservationsComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin', 'employee'] },
      },
      {
        path: 'reservations/create',
        component: ReservationFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin', 'employee'] },
      },

      // Users
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'users/create',
        component: UserFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'users/:id',
        component: UserFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },

      // Vehicles
      {
        path: 'vehicles',
        component: VehiclesComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'vehicles/create',
        component: VehicleFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'vehicles/:id',
        component: VehicleFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },

      // Vehicle Models
      {
        path: 'vehicle-models',
        component: VehicleModelsComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'vehicle-models/create',
        component: VehicleModelFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },
      {
        path: 'vehicle-models/:id',
        component: VehicleModelFormComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin'] },
      },

      // Communication
      {
        path: 'communication',
        component: CommunicationByEmailComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['admin', 'employee'] },
      },
    ],
  },

  // Client
  {
    path: 'reservation',
    component: ReservationStepperComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['client'] },
  },
  {
    path: 'user-reservations',
    component: ReservationsClientComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['client'] },
  },

  // Profile
  {
    path: 'user/:id',
    component: ProfileComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['admin', 'employee', 'client'] },
  },

  // Default
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
