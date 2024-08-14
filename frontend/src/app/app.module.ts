import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterOutlet } from '@angular/router';
import { ResponsiveNavbarComponent } from './responsive-navbar/responsive-navbar.component.js';
import { CategoriasFolderModule } from './categorias-folder/categorias-folder.module.js';
import { ClientsFolderModule } from './clients-folder/clients-folder.module.js';
import { ColorsFolderModule } from './colors-folder/colors-folder.module.js';
import { MarcasFolderModule } from './marcas-folder/marcas-folder.module.js';
import { ModelosFolderModule } from './modelos-folder/modelos-folder.module.js';
import { SucursalesFolderModule } from './sucursales-folder/sucursales-folder.module.js';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent // Declara el componente principal de la aplicación
  ],
  imports: [
    BrowserModule, // Importa BrowserModule para que la aplicación pueda ejecutarse en un navegador
    CommonModule,
    RouterOutlet,
    ResponsiveNavbarComponent,
    CategoriasFolderModule,
    ClientsFolderModule,
    ColorsFolderModule,
    MarcasFolderModule,
    ModelosFolderModule,
    SucursalesFolderModule,
  ],
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent] // Especifica el componente raíz que Angular debe inicializar al arrancar la aplicación
})
export class AppModule {}