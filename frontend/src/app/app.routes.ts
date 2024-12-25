// Angular
import { Routes } from '@angular/router';

// Pages
import { HomePageComponent } from '@pages/home/home.component';
import { StaffMenuComponent } from '@pages/staff/components/staff-menu/staff-menu.component';

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

// Vehicle
import { VehiclesComponent } from '@core/vehicle/components/vehicles/vehicles.component';
import { VehicleFormComponent } from '@core/vehicle/components/vehicle-form/vehicle-form.component';

// Vehicle Model
import { VehicleModelsComponent } from '@core/vehicle-model/components/vehicle-models/vehicle-models.component';
import { VehicleModelFormComponent } from '@core/vehicle-model/components/vehicle-model-form/vehicle-model-form.component';

// Reservation
import { ReservationsComponent } from '@core/reservation/components/reservations/reservations.component';
import { ReservationsClientComponent } from '@core/reservation/components/reservations-client/reservations-client.component';
import { ReservationFormComponent } from '@core/reservation/components/reservation-form/reservation-form.component';
import { ReservationStepperComponent } from '@core/reservation/components/reservation-stepper/reservation-stepper.component';

// User
import { ComunicationByEmailComponent } from '@core/user/components/comunication-by-email/comunication-by-email.component';
import { EmailVerificationComponent } from '@core/user/components/email-verification/email-verification.component';
import { ForgotPasswordComponent } from '@core/user/components/forgot-password/forgot-password.component';
import { LoginComponent } from '@core/user/components/login/login.component';
import { ProfileComponent } from '@core/user/components/profile/profile.component';
import { RegisterComponent } from '@core/user/components/register/register.component';
import { ResetPasswordComponent } from '@core/user/components/reset-password/reset-password.component';
import { UsersComponent } from '@core/user/components/users/users.component';
import { UserFormComponent } from '@core/user/components/user-form/user-form.component';

// Guards
import { authAdminGuard } from '@security/guards/auth-admin.guard';
import { authClientGuard } from '@security/guards/auth-client.guard';
import { authEmployeeGuard } from '@security/guards/auth-employee.guard';
import { authGuard } from '@security/guards/auth.guard';

// Test
import { TestMatiComponent } from '@test/components/test-mati/test-mati.component';

export const routes: Routes = [
  // Home-Page
  { path: 'home', component: HomePageComponent },

  // Authentication
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email/:token', component: EmailVerificationComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'user/:id', component: ProfileComponent, canActivate: [authGuard] },

  // Reservations
  {
    path: 'reservation',
    component: ReservationStepperComponent,
    canActivate: [authClientGuard],
  },
  {
    path: 'user-reservations',
    component: ReservationsClientComponent,
    canActivate: [authClientGuard],
  },

  // Staff and Administration
  {
    path: 'staff',
    component: StaffMenuComponent,
    canActivate: [authEmployeeGuard],
    children: [
      // Locations
      {
        path: 'locations',
        component: LocationsComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'locations/create',
        component: LocationFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'locations/:id',
        component: LocationFormComponent,
        canActivate: [authAdminGuard],
      },

      // Brands
      {
        path: 'brands',
        component: BrandsComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'brands/create',
        component: BrandFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'brands/:id',
        component: BrandFormComponent,
        canActivate: [authAdminGuard],
      },

      // Colors
      {
        path: 'colors',
        component: ColorsComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'colors/create',
        component: ColorFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'colors/:id',
        component: ColorFormComponent,
        canActivate: [authAdminGuard],
      },

      // Categories
      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'categories/create',
        component: CategoryFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'categories/:id',
        component: CategoryFormComponent,
        canActivate: [authAdminGuard],
      },

      // Reservations
      {
        path: 'reservations',
        component: ReservationsComponent,
      },
      {
        path: 'reservations/create',
        component: ReservationFormComponent,
      },

      // Vehicles
      {
        path: 'vehicles',
        component: VehiclesComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'vehicles/create',
        component: VehicleFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'vehicles/:id',
        component: VehicleFormComponent,
        canActivate: [authAdminGuard],
      },

      // Vehicle Models
      {
        path: 'vehicle-models',
        component: VehicleModelsComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'vehicle-models/create',
        component: VehicleModelFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'vehicle-models/:id',
        component: VehicleModelFormComponent,
        canActivate: [authAdminGuard],
      },

      // Users
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'users/create',
        component: UserFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'users/:id',
        component: UserFormComponent,
        canActivate: [authAdminGuard],
      },

      // Communication
      {
        path: 'comunication',
        component: ComunicationByEmailComponent,
      },
    ],
  },

  // Test
  { path: 'testMati', component: TestMatiComponent },

  // Default
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
