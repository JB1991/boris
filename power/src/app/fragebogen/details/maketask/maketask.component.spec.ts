import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { MaketaskComponent } from './maketask.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.MaketaskComponent', () => {
    let component: MaketaskComponent;
    let fixture: ComponentFixture<MaketaskComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                CommonModule,
                FormsModule,
                SharedModule
            ],
            providers: [
                AlertsService,
                FormAPIService
            ],
            declarations: [
                MaketaskComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MaketaskComponent);
        component = fixture.componentInstance;

        spyOn(console, 'error');
        fixture.detectChanges();
    }));

    it('should open and close', () => {
        fixture.detectChanges();
        component.open();
        expect(component.modal?.isOpen).toBeTrue();
        component.modal?.close();
        expect(component.modal?.isOpen).toBeFalse();
    });

    afterEach(() => {

    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
