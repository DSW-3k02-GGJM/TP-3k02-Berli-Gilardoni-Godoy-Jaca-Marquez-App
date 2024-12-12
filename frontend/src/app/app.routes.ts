import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CategoriesComponent } from './cat-folder/categories/categories.component';
import { CategoryFormComponent } from './cat-folder/category-form/category-form.component';
import { BrandsComponent } from './brand-folder/brands/brands.component.js';
import { BrandFormComponent } from './brand-folder/brand-form/brand-form.component.js';
import { ColorsComponent } from './col-folder/colors/colors.component';
import { ColorFormComponent } from './col-folder/color-form/color-form.component';
import { LocationsComponent } from './loc-folder/locations/locations.component.js';
import { LocationFormComponent } from './loc-folder/location-form/location-form.component.js';
import { VehicleModelsComponent } from './vehicleModel-folder/vehicleModels/vehicleModels.component.js';
import { VehicleModelFormComponent } from './vehicleModel-folder/vehicleModel-form/vehicleModel-form.component.js';
import { VehicleListComponent } from './vehicle-folder/vehicle-list/vehicle-list.component';
import { TestMatiComponent } from './test/test-mati/test-mati.component.js';
import { LoginComponent } from './user-folder/login/login.component';
import { RegisterComponent } from './user-folder/register/register.component';
import { authGuard } from './guards/auth.guard';
import { VehiclesComponent } from './vehicle-folder/vehicles/vehicles.component';
import { VehicleFormComponent } from './vehicle-folder/vehicle-form/vehicle-form.component';
import { ResComponent } from './res-folder/res/res.component.js';
import { ResFormComponent } from './res-folder/res-form/res-form.component.js';
import { authAdminGuard } from './guards/auth-admin.guard.js';
import { authEmployeeGuard } from './guards/auth-employee.guard.js';
import { authClientGuard } from './guards/auth-client.guard.js';
import { ProfileComponent } from './user-folder/profile/profile.component.js';
import { UserFormComponent } from './user-folder/user-form/user-form.component.js';
import { UsersComponent } from './user-folder/users/users.component.js';
import { StaffComponent } from './staff-folder/admin/staff.component.js';
import { ResStepperComponent } from './res-folder/res-stepper/res-stepper.component.js';
import { ResClientComponent } from './res-folder/res-client/res-client.component.js';
import { EmailVerificationComponent } from './user-folder/email-verification/email-verification.component.js';
import { ResetPasswordComponent } from './user-folder/reset-password/reset-password.component.js';
import { ForgotPasswordComponent } from './user-folder/forgot-password/forgot-password.component.js';
import { ComunicationByEmailComponent } from './user-folder/comunication-by-email/comunication-by-email.component.js';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  {
    path: 'reserva',
    component: ResStepperComponent,
    canActivate: [authClientGuard],
  },
  // este es el de las tarjetitas
  { path: 'vehicles', component: VehicleListComponent },
  // este es el de alta pero para el admin
  { path: 'testMati', component: TestMatiComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/:id', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'verify-email/:token', component: EmailVerificationComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'user-reservations',
    component: ResClientComponent,
    canActivate: [authClientGuard],
  },

  {
    path: 'staff',
    component: StaffComponent,
    canActivate: [authEmployeeGuard],
    children: [
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

      {
        path: 'vehicleModels',
        component: VehicleModelsComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'vehicleModels/create',
        component: VehicleModelFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'vehicleModels/:id',
        component: VehicleModelFormComponent,
        canActivate: [authAdminGuard],
      },

      {
        path: 'vehiclesS',
        component: VehiclesComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'vehiclesS/create',
        component: VehicleFormComponent,
        canActivate: [authAdminGuard],
      },
      {
        path: 'vehiclesS/:id',
        component: VehicleFormComponent,
        canActivate: [authAdminGuard],
      },

      { path: 'reservations', component: ResComponent },
      { path: 'reservations/create', component: ResFormComponent },
      { path: 'reservations/:id', component: ResFormComponent },

      { path: 'comunication', component: ComunicationByEmailComponent },
    ],
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
  //TODO: revisar
  // esto son para los alquileres hechos por el cliente (usuario)
  { path: 'reservationCli', component: ResComponent },
  { path: 'reservationCli/create', component: ResFormComponent },
  { path: 'reservationCli/modify/:id', component: ResFormComponent },
];
