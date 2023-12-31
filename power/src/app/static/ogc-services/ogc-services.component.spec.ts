import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { OgcServicesComponent } from './ogc-services.component';

describe('OgcServicesComponent', () => {
    let component: OgcServicesComponent;
    let fixture: ComponentFixture<OgcServicesComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule,
                AccordionModule.forRoot()
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
