import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { AppModule } from './app.module';

describe('AppModule', () => {
    let appModule: AppModule;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ]
        });

        spyOn(console, 'log');
        spyOn(console, 'error');
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        appModule = new AppModule();
    }));

    it('should create an instance', () => {
        expect(appModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
