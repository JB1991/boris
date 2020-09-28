import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BodenrichtwertVerlaufComponent } from './bodenrichtwert-verlauf.component';

describe('Bodenrichtwert.BodenrichtwertVerlauf.BodenrichtwertVerlaufComponent', () => {
    let component: BodenrichtwertVerlaufComponent;
    let fixture: ComponentFixture<BodenrichtwertVerlaufComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertVerlaufComponent],
            imports: [
                HttpClientTestingModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertVerlaufComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
