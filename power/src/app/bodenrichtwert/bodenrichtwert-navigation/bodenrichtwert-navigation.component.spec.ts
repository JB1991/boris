import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BodenrichtwertNavigationComponent } from './bodenrichtwert-navigation.component';
import { BodenrichtwertComponent } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';
import { Feature, FeatureCollection, Point } from 'geojson';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimpleChange } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { LngLat } from 'maplibre-gl';

describe('Bodenrichtwert.BodenrichtwertNavigation.BodenrichtwertNavigationComponent', () => {
    const feature: Feature<Point> = require('../../../testdata/bodenrichtwert/bodenrichtwert-karte-feature.json');
    const featureCollection = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-featurecollection.json');
    const flurstueck: FeatureCollection = require('../../../testdata/flurstueck-search/flurstueck-collection.json');

    let component: BodenrichtwertNavigationComponent;
    let fixture: ComponentFixture<BodenrichtwertNavigationComponent>;

    const lat = 52.40729;
    const lng = 9.80205;
    const stichtag = '2018-12-31';

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertNavigationComponent],
            imports: [
                CommonModule,
                HttpClientTestingModule,
                SharedModule,
                RouterModule.forRoot([]),
            ],
            providers: [
                DatePipe,
                BodenrichtwertComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.latLng = new LngLat(lng, lat);
        component.teilmarkt = {
            'value': [''],
            'text': '',
            'hexColor': ''
        };

        spyOn(component.latLngChange, 'emit');
        spyOn(component.teilmarktChange, 'emit');
        spyOn(component.alerts, 'NewAlert');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnChanges should work for changes', () => {
        spyOn(component, 'updateData');
        component.ngOnChanges({
            latLng: new SimpleChange(false, true, false),
        });
        expect(component.updateData).toHaveBeenCalledTimes(1);
        component.ngOnChanges({
            teilmarkt: new SimpleChange(true, false, false),
        });
        expect(component.updateData).toHaveBeenCalledTimes(2);
        component.ngOnChanges({
            stichtag: new SimpleChange(true, false, false)
        });
        expect(component.updateData).toHaveBeenCalledTimes(3);
    });

    it('updateData should update address, BRW and Flurstueck', () => {
        spyOn(component, 'getAddressFromLatLng');
        spyOn(component, 'getBodenrichtwertzonen');
        spyOn(component, 'getFlurstueckFromLatLng');
        component.updateData();
        expect(component.getAddressFromLatLng).toHaveBeenCalledTimes(1);
        expect(component.getBodenrichtwertzonen).toHaveBeenCalledTimes(1);
        expect(component.getFlurstueckFromLatLng).toHaveBeenCalledTimes(1);
    });

    it('getBodenrichtwertzonen should call BodenrichtwertService', () => {
        spyOn(component.bodenrichtwertService, 'getFeatureByLatLonEntw').and.callThrough();
        if (component.teilmarkt) {
            component.getBodenrichtwertzonen(lat, lng, component.teilmarkt?.value);
        }
        expect(component.bodenrichtwertService.getFeatureByLatLonEntw).toHaveBeenCalledTimes(1);
    });

    it('getAddressFromLatLng should call GeosearchService', () => {
        spyOn(component.geosearchService, 'getAddressFromCoordinates').and.callThrough();
        component.getAddressFromLatLng(lat, lng);
        expect(component.geosearchService.getAddressFromCoordinates).toHaveBeenCalledTimes(1);
    });

    it('getFlurstueckFromLatLng should call AlkisWfsService', () => {
        spyOn(component.alkisWfsService, 'getFlurstueckfromCoordinates').and.callThrough();
        component.getFlurstueckFromLatLng(lat, lng);
        expect(component.alkisWfsService.getFlurstueckfromCoordinates).toHaveBeenCalledTimes(1);
    });

    it('onStichtagChange should update the Stichtag attribute', () => {
        spyOn(component.stichtagChange, 'emit').and.callThrough();
        component.onStichtagChange(stichtag);
        expect(component.stichtagChange.emit).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    });

    it('onTeilmarktChange should update the Teilmarkt attribute', () => {
        const teilmarkt = {
            'value': [''],
            'text': '',
            'hexColor': ''
        };
        component.onTeilmarktChange(teilmarkt);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.teilmarktChange.emit).toHaveBeenCalledTimes(1);
    });

    it('onAddressChange should emit latLng of given feature', () => {
        component.onAddressChange(feature);
        expect(component.latLngChange.emit).toHaveBeenCalledTimes(1);
    });

    it('onFlurstueckChange should emit latLng', () => {
        component.onFlurstueckChange(flurstueck);
        expect(component.latLngChange.emit).toHaveBeenCalledTimes(1);
    });

    it('resetMap should emit changes to reset the map', () => {
        spyOn(component.featuresChange, 'emit');
        spyOn(component.flurstueckChange, 'emit');
        spyOn(component.isCollapsedChange, 'emit');
        spyOn(component.stichtagChange, 'emit');
        spyOn(component.addressChange, 'emit');
        component.features = JSON.parse(JSON.stringify(featureCollection));
        component.flurstueck = flurstueck;
        component.isCollapsed = false;
        component.stichtag = stichtag;
        component.address = feature;
        component.resetMap();
        expect(component.latLngChange.emit).toHaveBeenCalledTimes(1);
        expect(component.addressChange.emit).toHaveBeenCalledTimes(1);
        expect(component.featuresChange.emit).toHaveBeenCalledTimes(1);
        expect(component.isCollapsedChange.emit).toHaveBeenCalledTimes(1);
        expect(component.teilmarktChange.emit).toHaveBeenCalledTimes(1);
        expect(component.stichtagChange.emit).toHaveBeenCalledTimes(1);
    });

    it('onFocus should emit latLng to trigger map focus', () => {
        component.onFocus();
        expect(component.latLngChange.emit).toHaveBeenCalledTimes(1);
    });

});
