import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { GlobalErrorHandlerService } from './app/global-error-handler.service';
import { HttpInterceptorService } from './app/http-interceptor-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserAnimationsModule),
    {
      provide: MatSnackBar,
      useClass: MatSnackBar,
    },
    {
      provide: MatProgressSpinner,
      useClass: MatProgressSpinner,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
