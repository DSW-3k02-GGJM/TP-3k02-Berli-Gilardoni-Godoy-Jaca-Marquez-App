import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ClientsComponent } from './clients-folder/clients/clients.component';
import { ClientFormComponent } from './clients-folder/client-form/client-form.component';
import { CategoriasComponent } from './categorias-folder/categorias/categorias.component';
import { CategoriaFormComponent } from './categorias-folder/categoria-form/categoria-form.component';
import { MarcasComponent } from './marcas-folder/marcas/marcas.component';
import { MarcaFormComponent } from './marcas-folder/marca-form/marca-form.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { ModelosComponent } from './modelos-folder/modelos/modelos.component';
import { ModeloFormComponent } from './modelos-folder/modelo-form/modelo-form.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'clientes', component: ClientsComponent },
  { path: 'clientes/creacion', component: ClientFormComponent },
  { path: 'clientes/modificacion/:id', component: ClientFormComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'categorias/creacion', component: CategoriaFormComponent },
  { path: 'categorias/modificacion/:id', component: CategoriaFormComponent },
  { path: 'marcas', component: MarcasComponent },
  { path: 'marcas/creacion', component: MarcaFormComponent },
  { path: 'marcas/modificacion/:id', component: MarcaFormComponent },
  { path: 'modelos', component: ModelosComponent },
  { path: 'modelos/creacion', component: ModeloFormComponent },
  { path: 'modelos/modificacion/:id', component: ModeloFormComponent },
  { path: 'vehiculos', component: VehicleListComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
