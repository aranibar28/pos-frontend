import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { registerLocaleData } from '@angular/common';
import localePE from '@angular/common/locales/es-PE';
registerLocaleData(localePE);

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './common/interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
