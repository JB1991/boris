import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BodenrichtwertComponent } from './bodenrichtwert.component';
import { BodenrichtwertKarteComponent } from '../bodenrichtwert-karte/bodenrichtwert-karte.component';
import { BodenrichtwertVerlaufComponent } from '../bodenrichtwert-verlauf/bodenrichtwert-verlauf.component';
import { BodenrichtwertNavigationComponent } from '../bodenrichtwert-navigation/bodenrichtwert-navigation.component';
import { BodenrichtwertPdfComponent } from '../bodenrichtwert-pdf/bodenrichtwert-pdf.component';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FeatureCollection } from 'geojson';
import { LngLat } from 'maplibre-gl';

describe('Bodenrichtwert.BodenrichtwertComponent.BodenrichtwertComponent', () => {
    let component: BodenrichtwertComponent;
    let fixture: ComponentFixture<BodenrichtwertComponent>;
    let httpTestingController: HttpTestingController;

    const features: FeatureCollection = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-featurecollection.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
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
                CollapseModule.forRoot(),
                AlertModule.forRoot()
            ],
            providers: [
                DatePipe,
                DecimalPipe
            ]
        }).compileComponents();
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

    it('getStichtag should return the correct stichtag for data of Bremen/Bremerhaven', () => {
        component.features = JSON.parse(JSON.stringify(features));
        // Bremerhaven
        component.features.features[0].properties.gema = 'Bremerhaven';
        expect(component.features.features[0].properties.gema).toEqual('Bremerhaven');

        component.stichtag = '2020-12-31';
        expect(component.getStichtag()).toEqual('2019-12-31');

        // Bremen
        component.features.features[0].properties.gema = 'Bremen';
        component.features.features[0].properties.gabe = 'Gutachterausschuss für Grundstückswerte in Bremen';

        expect(component.features.features[0].properties.gabe).toEqual('Gutachterausschuss für Grundstückswerte in Bremen');

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
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
