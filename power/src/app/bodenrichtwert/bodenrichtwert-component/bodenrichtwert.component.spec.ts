import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { BodenrichtwertComponent } from './bodenrichtwert.component';
import { BodenrichtwertKarteComponent } from '../bodenrichtwert-karte/bodenrichtwert-karte.component';
import { BodenrichtwertVerlaufComponent } from '../bodenrichtwert-verlauf/bodenrichtwert-verlauf.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { exec } from 'child_process';

describe('Bodenrichtwert.BodenrichtwertComponent.BodenrichtwertComponent', () => {
    let component: BodenrichtwertComponent;
    let fixture: ComponentFixture<BodenrichtwertComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertComponent,
                BodenrichtwertKarteComponent,
                BodenrichtwertVerlaufComponent
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
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
