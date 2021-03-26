import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PlatformModule } from '@angular/cdk/platform';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GlobalErrorHandler } from './errorhandler';
import { ModuleGuard } from './module.guard';
import { AuthModule } from '@app/shared/auth/auth.module';
import { AlertsModule } from '@app/shared/alerts/alerts.module';
import { LoadingscreenModule } from '@app/shared/loadingscreen/loadingscreen.module';
import { UpdateService } from './update.service';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'power' }),
        AppRoutingModule,
        CommonModule,
        PlatformModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CollapseModule.forRoot(),
        AlertModule.forRoot(),
        AuthModule,
        AlertsModule,
        LoadingscreenModule,
        NgbModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        ModuleGuard,
        UpdateService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
