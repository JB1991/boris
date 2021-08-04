import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe, DecimalPipe } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { BodenrichtwertKarteService } from '../bodenrichtwert-karte/bodenrichtwert-karte.service';
import { EntwicklungszustandPipe } from '../pipes/entwicklungszustand.pipe';
import { VerfahrensartPipe } from '../pipes/verfahrensart.pipe';
import { EntwicklungszusatzPipe } from '../pipes/entwicklungszusatz.pipe';
import { NutzungPipe } from '../pipes/nutzung.pipe';
import { BeitragPipe } from '../pipes/beitrag.pipe';
import { BauweisePipe } from '../pipes/bauweise.pipe';
import { BodenartPipe } from '../pipes/bodenart.pipe';
import { UmlautCorrectionPipe } from '../pipes/umlaut-correction.pipe';

import { BodenrichtwertPdfComponent } from './bodenrichtwert-pdf.component';
import { GemarkungPipe } from '@app/shared/pipes/gemarkung.pipe';

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
                DecimalPipe,
                EntwicklungszustandPipe,
                VerfahrensartPipe,
                EntwicklungszusatzPipe,
                BeitragPipe,
                NutzungPipe,
                BauweisePipe,
                BodenartPipe,
                UmlautCorrectionPipe,
                GemarkungPipe
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
