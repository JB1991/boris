import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BodenrichtwertDetailComponent } from './bodenrichtwert-detail.component';
import { BeitragPipe } from '@app/bodenrichtwert/pipes/beitrag.pipe';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';
import { UmlautCorrectionPipe } from '@app/bodenrichtwert/pipes/umlaut-correction.pipe';
import { HyphenatePipe } from '@app/shared/pipes/hyphenate.pipe';

describe('Bodenrichtwert.BodenrichtwertDetail.BodenrichtwertDetailComponent', () => {
    let component: BodenrichtwertDetailComponent;
    let fixture: ComponentFixture<BodenrichtwertDetailComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertDetailComponent,
                BeitragPipe,
                NutzungPipe,
                HyphenatePipe,
                UmlautCorrectionPipe
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertDetailComponent);
        component = fixture.componentInstance;
        component.feature = {
            properties: {
                nutzung: [{nutz: 'W', 'enuta': ['EFH']}]
            }
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
