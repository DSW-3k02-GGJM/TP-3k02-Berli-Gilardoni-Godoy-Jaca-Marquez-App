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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // agrego esto para el modal

// esto lo agregue recien
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent, // Declara el componente principal de la aplicación
  ],
  imports: [
    BrowserModule, // Importa BrowserModule para que la aplicación pueda ejecutarse en un navegador
    CommonModule,
    RouterOutlet,
    ResponsiveNavbarComponent,
    HttpClientModule, // no hace nada por ahora
    NgbModule, // Agrega el módulo de Bootstrap
  ],
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideHttpClient(),
    //provideHttpClient(withInterceptors([authInterceptor])),
    AuthService
  ],
  bootstrap: [AppComponent] // Especifica el componente raíz que Angular debe inicializar al arrancar la aplicación
})
export class AppModule {}
