import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe, DecimalPipe } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { BodenrichtwertKarteService } from '../bodenrichtwert-karte/bodenrichtwert-karte.service';

import { BodenrichtwertPdfComponent } from './bodenrichtwert-pdf.component';

describe('Bodenrichtwert.BodenrichtwertPdf.BodenrichtwertPdfComponent', () => {
    let component: BodenrichtwertPdfComponent;
    let fixture: ComponentFixture<BodenrichtwertPdfComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BodenrichtwertPdfComponent]
        })
            .compileComponents();
    });

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertPdfComponent
            ],
            imports: [
                HttpClientTestingModule,
                SharedModule
            ],
            providers: [
                BodenrichtwertKarteService,
                DatePipe,
                DecimalPipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BodenrichtwertPdfComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
