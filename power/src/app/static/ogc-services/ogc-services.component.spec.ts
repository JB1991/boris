import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';

import { OgcServicesComponent } from './ogc-services.component';

describe('OgcServicesComponent', () => {
    let component: OgcServicesComponent;
    let fixture: ComponentFixture<OgcServicesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                Title,
                Meta
            ],
            declarations: [
                OgcServicesComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(OgcServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
