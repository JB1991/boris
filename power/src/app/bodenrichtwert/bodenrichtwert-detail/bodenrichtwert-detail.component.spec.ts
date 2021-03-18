import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BodenrichtwertDetailComponent } from './bodenrichtwert-detail.component';
import { BeitragPipe } from '@app/bodenrichtwert/pipes/beitrag.pipe';
import { NutzungPipe } from '@app/bodenrichtwert/pipes/nutzung.pipe';
import { UmlautCorrectionPipe } from '@app/bodenrichtwert/pipes/umlaut-correction.pipe';
import { HyphenatePipe } from '@app/shared/pipes/hyphenate.pipe';
import { EntwicklungszusatzPipe } from '../pipes/entwicklungszusatz.pipe';
import { EntwicklungszustandPipe } from '../pipes/entwicklungszustand.pipe';
import { NutzungBremenPipe } from '../pipes/nutzung-bremen.pipe';
import { FeatureCollection } from 'geojson';
import { GagKontaktdatenPipe } from '../pipes/gag-kontaktdaten.pipe';

describe('Bodenrichtwert.BodenrichtwertDetail.BodenrichtwertDetailComponent', () => {
    let component: BodenrichtwertDetailComponent;
    let fixture: ComponentFixture<BodenrichtwertDetailComponent>;
    const features: FeatureCollection = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-featurecollection.json');

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
                EntwicklungszustandPipe,
                GagKontaktdatenPipe
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertDetailComponent);
        component = fixture.componentInstance;
        component.features = JSON.parse(JSON.stringify(features));
        component.filteredFeatures = JSON.parse(JSON.stringify(features.features));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return false', () => {
        const result = component.enutaBremen(component.features.features[0]);
        expect(result).toBeFalse();
    });

    it('should return true', () => {
        component.features.features[0].properties.nutzung[0].enuta[0] = 'G3';

        const result = component.enutaBremen(component.features.features[0]);
        expect(result).toBeTrue();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
