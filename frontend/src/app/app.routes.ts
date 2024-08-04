import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component.js';
import { FormFloatingComponent } from './form-floating/form-floating.component.js';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component.js';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'registro', component: FormFloatingComponent },
  { path: 'vehiculos', component: VehicleListComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
