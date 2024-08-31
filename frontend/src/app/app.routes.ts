import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ClientsComponent } from './cli-folder/clients/clients.component';
import { ClientFormComponent } from './cli-folder/client-form/client-form.component';
import { CategoriesComponent } from './cat-folder/categories/categories.component';
import { CategoryFormComponent } from './cat-folder/category-form/category-form.component';
import { MarcasComponent } from './mar-folder/marcas/marcas.component';
import { MarcaFormComponent } from './mar-folder/marca-form/marca-form.component';
import { ColorsComponent } from './col-folder/colors/colors.component';
import { ColorFormComponent } from './col-folder/color-form/color-form.component';
import { SucursalesComponent } from './suc-folder/sucursales/sucursales.component';
import { SucursalFormComponent } from './suc-folder/sucursal-form/sucursal-form.component';
import { ModelosComponent } from './mod-folder/modelos/modelos.component';
import { ModeloFormComponent } from './mod-folder/modelo-form/modelo-form.component';
import { VehicleListComponent } from './veh-folder/vehicle-list/vehicle-list.component';
import { TestMatiComponent } from './test/test-mati/test-mati.component.js';
import {LoginComponent} from "./usuario-folder/login/login.component";
import {RegisterComponent} from "./usuario-folder/register/register.component";
import {LogoutComponent} from "./usuario-folder/logout/logout.component";
import {authGuard} from "./auth.guard";
import { VehiclesComponent } from './veh-folder/vehicles/vehicles.component';
import { VehicleFormComponent } from './veh-folder/vehicle-form/vehicle-form.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'clientes', component: ClientsComponent, canActivate: [authGuard] },
  { path: 'clientes/creacion', component: ClientFormComponent },
  { path: 'clientes/modificacion/:id', component: ClientFormComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/creacion', component: CategoryFormComponent },
  { path: 'categories/modificacion/:id', component: CategoryFormComponent },
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
  // este es el de las tarjetitas
  { path: 'vehiculos', component: VehicleListComponent },
  // este es el de alta pero para el admin
  { path: 'vehiculosAdmin', component: VehiclesComponent },
  { path: 'vehiculos/creacion', component: VehicleFormComponent },
  { path: 'vehiculos/modificacion/:id', component: VehicleFormComponent },
  { path: 'testMati', component: TestMatiComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
