import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Config, ConfigService } from '@app/config.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, ObservableInput, of } from 'rxjs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { environment } from '@env/environment';

import { AuthModule } from '@app/shared/auth/auth.module';
import { AlertsModule } from '@app/shared/alerts/alerts.module';
import { LoadingscreenModule } from '@app/shared/loadingscreen/loadingscreen.module';

export function load(httpClient: HttpClient, configService: ConfigService) {
    return (): Promise<boolean> => {
        return new Promise<boolean>((resolve: (a: boolean) => void): void => {
            httpClient.get<Config>('./assets/config/config.json')
                .pipe(
                    map((x: Config) => {
                        configService.config = x;
                        resolve(true);
                    }),
                    catchError((x: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
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
        AppRoutingModule,
        CommonModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CollapseModule.forRoot(),
        AuthModule,
        AlertsModule,
        LoadingscreenModule,
        ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
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
/* vim: set expandtab ts=4 sw=4 sts=4: */
