import { provideHttpClient } from '@angular/common/http';
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import '@google/model-viewer';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(),
  ],
}).catch((err) => console.error(err));
