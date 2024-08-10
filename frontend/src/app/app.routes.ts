import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ClientsComponent } from './clients-folder/clients/clients.component';
import { ClientFormComponent } from './clients-folder/client-form/client-form.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { MarcasComponent } from './marcas-folder/marcas/marcas.component';
import { MarcaFormComponent } from './marcas-folder/marca-form/marca-form.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'clientes', component: ClientsComponent },
  { path: 'clientes/creacion', component: ClientFormComponent },
  { path: 'clientes/modificacion/:id', component: ClientFormComponent },
  { path: 'marcas', component: MarcasComponent },
  { path: 'marcas/creacion', component: MarcaFormComponent },
  { path: 'marcas/modificacion/:id', component: MarcaFormComponent },
  { path: 'vehiculos', component: VehicleListComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
