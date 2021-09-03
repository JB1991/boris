import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BodenrichtwertComponent } from './bodenrichtwert.component';
import { BodenrichtwertKarteComponent } from '../bodenrichtwert-karte/bodenrichtwert-karte.component';
import { BodenrichtwertVerlaufComponent } from '../bodenrichtwert-verlauf/bodenrichtwert-verlauf.component';
import { BodenrichtwertNavigationComponent } from '../bodenrichtwert-navigation/bodenrichtwert-navigation.component';
import { BodenrichtwertPdfComponent } from '../bodenrichtwert-pdf/bodenrichtwert-pdf.component';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FeatureCollection } from 'geojson';
import { LngLat, LngLatBounds } from 'maplibre-gl';
import { EntwicklungszustandPipe } from '../pipes/entwicklungszustand.pipe';
import { VerfahrensartPipe } from '../pipes/verfahrensart.pipe';
import { EntwicklungszusatzPipe } from '../pipes/entwicklungszusatz.pipe';
import { NutzungPipe } from '../pipes/nutzung.pipe';
import { BeitragPipe } from '../pipes/beitrag.pipe';
import { BauweisePipe } from '../pipes/bauweise.pipe';
import { BodenartPipe } from '../pipes/bodenart.pipe';
import { UmlautCorrectionPipe } from '../pipes/umlaut-correction.pipe';

describe('Bodenrichtwert.BodenrichtwertComponent.BodenrichtwertComponent', () => {
    let component: BodenrichtwertComponent;
    let fixture: ComponentFixture<BodenrichtwertComponent>;

    const bounds = new LngLatBounds([
        [6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]
    ]);
    const features: FeatureCollection = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-featurecollection.json');

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertComponent,
                BodenrichtwertKarteComponent,
                BodenrichtwertVerlaufComponent,
                BodenrichtwertNavigationComponent,
                BodenrichtwertPdfComponent
            ],
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                RouterModule.forRoot([]),
                SharedModule,
                CollapseModule.forRoot()
            ],
            providers: [
                DatePipe,
                DecimalPipe,
                EntwicklungszustandPipe,
                VerfahrensartPipe,
                EntwicklungszusatzPipe,
                BeitragPipe,
                NutzungPipe,
                BauweisePipe,
                BodenartPipe,
                UmlautCorrectionPipe
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('getStichtag should return the correct stichtag for data of Bremen/Bremerhaven', () => {
        component.features = JSON.parse(JSON.stringify(features));

        // Bremerhaven
        if (component.features?.features[0].properties) {
            component.features.features[0].properties['gema'] = 'Bremerhaven';
        }
        expect(component.features?.features[0]?.properties?.['gema']).toEqual('Bremerhaven');

        component.stichtag = '2020-12-31';
        expect(component.getStichtag()).toEqual('2019-12-31');

        // Bremen
        if (component.features?.features[0].properties) {
            component.features.features[0].properties['gema'] = 'Bremen';
            component.features.features[0].properties['gabe'] = 'Gutachterausschuss für Grundstückswerte in Bremen';
        }

        expect(component.features?.features[0]?.properties?.['gabe']).toEqual('Gutachterausschuss für Grundstückswerte in Bremen');

        component.stichtag = '2018-12-31';
        expect(component.getStichtag()).toEqual('2018-12-31');

        component.stichtag = '2017-12-31';
        expect(component.getStichtag()).toEqual('2016-12-31');
    });

    it('changeURL should change the current URL params if changes are applied', () => {
        spyOn(component.location, 'replaceState');
        component.latLng = new LngLat(50, 9);
        component.stichtag = '2030-12-31';
        component.teilmarkt = component.TEILMAERKTE[0];
        component.zoom = 15.1;
        component.changeURL();
        expect(component.location.replaceState).toHaveBeenCalled();
    });

    it('checkIfStichtagFtsExist should return true/false depending on features exist for the current stichtag', () => {
        component.features = JSON.parse(JSON.stringify(features));
        component.stichtag = '2019-12-31';
        expect(component.checkIfStichtagFtsExist()).toBeTrue();
        component.stichtag = '1930-12-31';
        expect(component.checkIfStichtagFtsExist()).toBeFalse();
    });

    it('onExpandingEnds should invert expanded and set collapsed to false', () => {
        component.expanded = true;
        component.onExpandingEnds();
        expect(component.expanded).toBeFalse();
        expect(component.collapsed).toBeFalse();
    });

    it('onCollapsingEnds should invert collapsed and set expanded to false', () => {
        component.collapsed = false;
        component.onCollapsingEnds();
        expect(component.collapsed).toBeTrue();
        expect(component.expanded).toBeFalse();
    });

    it('validateZoom should validate the zoom param', () => {
        let zoom = component.validateZoom(100);
        expect(zoom).toEqual(18);
        zoom = component.validateZoom(-10);
        expect(zoom).toEqual(5);
        zoom = component.validateZoom(14.5);
        expect(zoom).toEqual(14.5);
    });

    it('validatePitch should validates the pitch param', () => {
        let pitch = component.validatePitch(100);
        expect(pitch).toEqual(60);
        pitch = component.validatePitch(-20);
        expect(pitch).toEqual(0);
        pitch = component.validatePitch(35.6);
        expect(pitch).toEqual(35.6);
    });

    it('validateBearing should validates the bearing param', () => {
        let bearing = component.validateBearing(200);
        expect(bearing).toEqual(180);
        bearing = component.validateBearing(-200);
        expect(bearing).toEqual(-180);
        bearing = component.validateBearing(1);
        expect(bearing).toEqual(1);
    });

    it('validateLngLat should validates the lngLat params', () => {
        component.bounds = bounds;
        expect(component.validateLngLat(52.3, 9.6)).toBeTrue();
        expect(component.validateLngLat(85.1, 140.5)).toBeFalse();
        expect(component.validateLngLat(300, 500)).toBeFalse();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
