import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { BodenwertKalkulatorComponent } from './bodenwert-kalkulator.component';
import { CommonModule } from '@angular/common';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BodenwertKalkulator.BodenwertKalkulator.BodenwertKalkulatorComponent', () => {
    let component: BodenwertKalkulatorComponent;
    let fixture: ComponentFixture<BodenwertKalkulatorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenwertKalkulatorComponent
            ],
            imports: [
                CommonModule,
                HttpClientTestingModule,
                NgbAccordionModule,
                NgxMapboxGLModule,
                FormsModule,
                ReactiveFormsModule,
                SharedModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenwertKalkulatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
