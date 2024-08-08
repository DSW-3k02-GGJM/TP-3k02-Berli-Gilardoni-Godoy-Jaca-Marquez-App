import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ClientsComponent } from './clients-folder/clients/clients.component';
import { ClientFormComponent } from './clients-folder/client-form/client-form.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { CategoriasComponent } from './categorias-folder/categorias/categorias.component.js';
import { CategoriasFormComponent } from './categorias-folder/categorias-form/categorias-form.component.js';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'clientes', component: ClientsComponent },
  { path: 'clientes/creacion', component: ClientFormComponent },
  { path: 'clientes/modificacion/:id', component: ClientFormComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'categorias/creacion', component: CategoriasFormComponent },
  { path: 'categorias/modificacion/:id', component: CategoriasFormComponent },
  { path: 'vehiculos', component: VehicleListComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
