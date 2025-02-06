// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Angular Material
import { MAT_DATE_LOCALE } from '@angular/material/core';

// Services
import { AuthService } from '@security/services/auth.service';

// Components
import { AppComponent } from './app.component';

// Layouts
import { NavbarComponent } from '@shared/layouts/navbar/navbar.component';

// Routing
import { routes } from './app.routes';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    NgbModule,
    BrowserModule,
    RouterOutlet,
    NavbarComponent,
  ],
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    AuthService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
