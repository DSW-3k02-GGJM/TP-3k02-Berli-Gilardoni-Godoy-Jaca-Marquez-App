import '@angular/compiler';
import { AppModule } from './app/app.module.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
