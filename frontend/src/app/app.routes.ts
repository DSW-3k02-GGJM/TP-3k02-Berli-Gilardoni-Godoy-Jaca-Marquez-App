import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ClientsComponent } from './clients-folder/clients/clients.component';
import { ClientFormComponent } from './clients-folder/client-form/client-form.component';
import { CategoriasComponent } from './categorias-folder/categorias/categorias.component';
import { CategoriaFormComponent } from './categorias-folder/categoria-form/categoria-form.component';
import { MarcasComponent } from './marcas-folder/marcas/marcas.component';
import { MarcaFormComponent } from './marcas-folder/marca-form/marca-form.component';
import { ColorsComponent } from './colors-folder/colors/colors.component';
import { ColorFormComponent } from './colors-folder/color-form/color-form.component';
import { SucursalesComponent } from './sucursales-folder/sucursales/sucursales.component';
import { SucursalFormComponent } from './sucursales-folder/sucursal-form/sucursal-form.component';
import { ModelosComponent } from './modelos-folder/modelos/modelos.component';
import { ModeloFormComponent } from './modelos-folder/modelo-form/modelo-form.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { TestMatiComponent } from './test/test-mati/test-mati.component.js';
import {LoginComponent} from "./usuario-folder/login/login.component";
import {RegisterComponent} from "./usuario-folder/register/register.component";
import {LogoutComponent} from "./usuario-folder/logout/logout.component";

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
  { path: 'colores', component: ColorsComponent },
  { path: 'colores/creacion', component: ColorFormComponent },
  { path: 'colores/modificacion/:id', component: ColorFormComponent },
  { path: 'sucursales', component: SucursalesComponent },
  { path: 'sucursales/creacion', component: SucursalFormComponent },
  { path: 'sucursales/modificacion/:id', component: SucursalFormComponent },
  { path: 'modelos', component: ModelosComponent },
  { path: 'modelos/creacion', component: ModeloFormComponent },
  { path: 'modelos/modificacion/:id', component: ModeloFormComponent },
  { path: 'vehiculos', component: VehicleListComponent },
  { path: 'testMati', component: TestMatiComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
