import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterOutlet } from '@angular/router';
import { ResponsiveNavbarComponent } from './responsive-navbar/responsive-navbar.component.js';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { AuthService } from "./service/auth.service";
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMM',
  },
};

@NgModule({
  declarations: [
    AppComponent // Declara el componente principal de la aplicación
  ],
  imports: [
    BrowserModule, // Importa BrowserModule para que la aplicación pueda ejecutarse en un navegador
    CommonModule,
    RouterOutlet,
    ResponsiveNavbarComponent,
  ],
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideHttpClient(),
    //provideHttpClient(withInterceptors([authInterceptor])),
    AuthService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Configurar el locale
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Proveer los formatos de fecha personalizados
  ],
  bootstrap: [AppComponent] // Especifica el componente raíz que Angular debe inicializar al arrancar la aplicación
})
export class AppModule {}
