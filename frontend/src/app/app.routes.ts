import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ClientsComponent } from './cli-folder/clients/clients.component';
import { ClientFormComponent } from './cli-folder/client-form/client-form.component';
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
import {LoginComponent} from "./user-folder/login/login.component";
import {RegisterComponent} from "./user-folder/register/register.component";
import {authGuard} from "./auth.guard";
import { VehiclesComponent } from './vehicle-folder/vehicles/vehicles.component';
import { VehicleFormComponent } from './vehicle-folder/vehicle-form/vehicle-form.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'clients', component: ClientsComponent, canActivate: [authGuard] },
  { path: 'clients/create', component: ClientFormComponent },
  { path: 'clients/modify/:id', component: ClientFormComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/create', component: CategoryFormComponent },
  { path: 'categories/modify/:id', component: CategoryFormComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'brands/create', component: BrandFormComponent },
  { path: 'brands/modify/:id', component: BrandFormComponent },
  { path: 'colors', component: ColorsComponent },
  { path: 'colors/create', component: ColorFormComponent },
  { path: 'colors/modify/:id', component: ColorFormComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'locations/create', component: LocationFormComponent },
  { path: 'locations/modify/:id', component: LocationFormComponent },
  { path: 'vehicleModels', component: VehicleModelsComponent },
  { path: 'vehicleModels/create', component: VehicleModelFormComponent },
  { path: 'vehicleModels/modify/:id', component: VehicleModelFormComponent },
  // este es el de las tarjetitas
  { path: 'vehicles', component: VehicleListComponent },
  // este es el de alta pero para el admin
  { path: 'vehiclesAdmin', component: VehiclesComponent },
  { path: 'vehicles/create', component: VehicleFormComponent },
  { path: 'vehicles/modify/:id', component: VehicleFormComponent },
  { path: 'testMati', component: TestMatiComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
