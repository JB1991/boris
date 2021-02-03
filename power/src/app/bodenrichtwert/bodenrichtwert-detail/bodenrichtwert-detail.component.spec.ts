import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BodenrichtwertDetailComponent } from './bodenrichtwert-detail.component';
import { BeitragPipe } from '@app/bodenrichtwert/pipes/beitrag.pipe';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';
import { UmlautCorrectionPipe } from '@app/bodenrichtwert/pipes/umlaut-correction.pipe';
import { HyphenatePipe } from '@app/shared/pipes/hyphenate.pipe';
import { EntwicklungszusatzPipe } from '../pipes/entwicklungszusatz.pipe';
import { EntwicklungszustandPipe } from '../pipes/entwicklungszustand.pipe';
import { NutzungBremenPipe } from '../pipes/nutzung-bremen.pipe';

describe('Bodenrichtwert.BodenrichtwertDetail.BodenrichtwertDetailComponent', () => {
    let component: BodenrichtwertDetailComponent;
    let fixture: ComponentFixture<BodenrichtwertDetailComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertDetailComponent,
                BeitragPipe,
                NutzungPipe,
                NutzungBremenPipe,
                HyphenatePipe,
                UmlautCorrectionPipe,
                EntwicklungszusatzPipe,
                EntwicklungszustandPipe
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertDetailComponent);
        component = fixture.componentInstance;
        component.feature = {
            properties: {
                nutzung: [{ nutz: 'W', 'enuta': ['G3'] }],
                entw: 'B',
                verf: 'SU'
            }
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return true', () => {
        const result = component.enutaBremen(component.feature);
        expect(result).toBe(true);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
