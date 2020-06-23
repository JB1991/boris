import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '@app/shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Config, ConfigService} from '@app/config.service';
import {catchError, map} from 'rxjs/operators';
import {Observable, ObservableInput, of} from 'rxjs';

function load(httpClient: HttpClient, configService: ConfigService) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      httpClient.get<Config>('./assets/config/config.json')
        .pipe(
          map((x: Config) => {
            configService.config = x;
            resolve(true);
          }),
          catchError((x: {status: number}, caught: Observable<void>): ObservableInput<{}> => {
            console.error('could not load config.json');
            if (x.status !== 404) {
              resolve(false);
            }
            resolve(true);
            return of({});
          })
        ).subscribe();
    });
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    SharedModule,
    AppRoutingModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {enabled: environment.production}),
    RouterModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      multi: true,
      deps: [
        HttpClient,
        ConfigService
      ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
