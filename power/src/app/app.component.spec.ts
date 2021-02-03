import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { UpdateService } from './update.service';

describe('AppComponent', () => {
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                ConfigService,
                AuthService,
                UpdateService,
                { provide: UpdateService, useClass: MockUpdateService }
            ],
            declarations: [
                AppComponent,
                MockAlertsComponent,
                MockLoadingscreenComponent
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;

        spyOn(console, 'log');
        spyOn(console, 'error');
        httpTestingController = TestBed.inject(HttpTestingController);
    }));

    it('should create the app', waitForAsync(() => {
        expect(app).toBeTruthy();

        spyOn(app.cdRef, 'detectChanges');
        app.ngAfterViewChecked();
    }));

    it('should have "power" as title', waitForAsync(() => {
        expect(app.title).toContain('power');
    }));

    it('should have a version number including a dot', waitForAsync(() => {
        expect(app.appVersion.version).toEqual('local');
    }));

    it('should load version', () => {
        app.configService.config = { 'modules': ['a', 'b'], 'authentication': false };
        app.ngOnInit();
        answerHTTPRequest('/assets/version.json', 'GET', { version: '123456', branch: 'prod' });
        expect(app.appVersion).toEqual({ version: '123456', branch: 'prod' });
    });

    it('should fail load version', () => {
        app.ngOnInit();
        answerHTTPRequest('/assets/version.json', 'GET', null, { status: 404, statusText: 'Not Found' });
        expect(app.appVersion).toEqual({ version: 'local', branch: 'offline' });
    });

    it('should fail load version 2', () => {
        app.ngOnInit();
        answerHTTPRequest('/assets/version.json', 'GET', { branch: 'toast' });
        expect(app.appVersion).toEqual({ version: 'local', branch: 'dev' });
    });

    /**
     * Mocks the API by taking HTTP requests form the queue and returning the answer
     * @param url The URL of the HTTP request
     * @param method HTTP request method
     * @param body The body of the answer
     * @param opts Optional HTTP information of the answer
     */
    const answerHTTPRequest = (url, method, body, opts?) => {
        // Take HTTP request from queue
        const request = httpTestingController.expectOne(url);
        expect(request.request.method).toEqual(method);

        // Return the answer
        request.flush(deepCopy(body), opts);
    };

    const deepCopy = (data) => JSON.parse(JSON.stringify(data));

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
    public checkForUpdates() { }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
