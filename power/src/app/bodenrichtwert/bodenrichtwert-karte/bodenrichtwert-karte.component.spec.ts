import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';

describe('Bodenrichtwert.BodenrichtwertKarte.BodenrichtwertkarteComponent', () => {
    let component: BodenrichtwertKarteComponent;
    let fixture: ComponentFixture<BodenrichtwertKarteComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertKarteComponent],
            imports: [
                CommonModule,
                HttpClientTestingModule,
                NgxMapboxGLModule,
                FormsModule,
                ReactiveFormsModule,
                SharedModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertKarteComponent);
        component = fixture.componentInstance;
        component.teilmarkt = '';
        fixture.detectChanges();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
