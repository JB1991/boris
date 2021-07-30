import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppModule } from './app.module';

describe('AppModule', () => {
    let appModule: AppModule;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ]
        });

        spyOn(console, 'error');
        appModule = new AppModule();
    }));

    it('should create an instance', () => {
        expect(appModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
