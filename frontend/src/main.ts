// Angular
import '@angular/compiler';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// AppModule
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err: Error) => console.error(err));
