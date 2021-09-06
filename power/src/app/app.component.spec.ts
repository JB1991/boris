import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from '@app/shared/auth/auth.service';
import { UpdateService } from './update.service';
import { SEOService } from './shared/seo/seo.service';

describe('AppComponent', () => {
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                AuthService,
                SEOService,
                { provide: UpdateService, useClass: MockUpdateService }
            ],
            declarations: [
                AppComponent,
                MockAlertsComponent,
                MockLoadingscreenComponent
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController);

        spyOn(console, 'error');
    }));

    it('should create the app', waitForAsync(() => {
        expect(app).toBeTruthy();

        spyOn(app.cdRef, 'detectChanges');
        app.ngAfterViewChecked();
    }));

    it('should have a version number', waitForAsync(() => {
        expect(app.appVersion.version).toEqual('dev');
        expect(app.appVersion.branch).toEqual('local');
    }));

    it('should load version', () => {
        spyOn(Math, 'random').and.returnValue(0.1);
        app.ngOnInit();
        answerHTTPRequest('/assets/version.json?cache-bust=0.1', 'GET', { version: '123456', branch: 'prod' });
        expect(app.appVersion).toEqual({ version: '123456', branch: 'prod' });
    });

    it('should fail load version', () => {
        spyOn(Math, 'random').and.returnValue(0.1);
        app.ngOnInit();
        answerHTTPRequest('/assets/version.json?cache-bust=0.1', 'GET', null, { status: 404, statusText: 'Not Found' });
        expect(app.appVersion).toEqual({ version: 'cache', branch: 'offline' });
    });

    it('should fail load version 2', () => {
        spyOn(Math, 'random').and.returnValue(0.1);
        app.ngOnInit();
        answerHTTPRequest('/assets/version.json?cache-bust=0.1', 'GET', { branch: 'toast' });
        expect(app.appVersion).toEqual({ version: 'dev', branch: 'local' });
    });

    /**
     * Mocks the API by taking HTTP requests form the queue and returning the answer
     * @param url The URL of the HTTP request
     * @param method HTTP request method
     * @param body The body of the answer
     * @param opts Optional HTTP information of the answer
     */
    const answerHTTPRequest = (url: string, method: string, body: any, opts?: any): void => {
        // Take HTTP request from queue
        const request = httpTestingController.expectOne(url);
        expect(request.request.method).toEqual(method);

        // Return the answer
        request.flush(deepCopy(body), opts);
    };

    const deepCopy = (data: any): any => JSON.parse(JSON.stringify(data));

    afterEach(() => {
        // Verify that no requests are remaining
        httpTestingController.verify();
    });
});

@Component({
    selector: 'power-alerts',
    template: ''
})
class MockAlertsComponent {
}
@Component({
    selector: 'power-loadingscreen',
    template: ''
})
class MockLoadingscreenComponent {
}
class MockUpdateService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public checkForUpdates(): void { }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
