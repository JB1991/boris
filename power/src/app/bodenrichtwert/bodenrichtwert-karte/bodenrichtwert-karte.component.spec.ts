import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { Map } from 'mapbox-gl';
import { Feature } from 'geojson';

describe('Bodenrichtwert.BodenrichtwertKarte.BodenrichtwertkarteComponent', () => {
    const feature: Feature = require('../../../assets/boden/bodenrichtwert-samples/bodenrichtwert-karte-feature.json');

    const entw = 'B';
    const lat = 52.40729;
    const lon = 9.80205;

    let component: BodenrichtwertKarteComponent;
    let fixture: ComponentFixture<BodenrichtwertKarteComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
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

        const map = new Map({
            container: 'map'
        });
        component.loadMap(map);

        spyOn(component.map, 'addLayer');
        spyOn(component.map, 'easeTo');
        spyOn(component.map, 'fitBounds');
        spyOn(component.map, 'flyTo');
        spyOn(component.map, 'setPaintProperty');
        spyOn(component.map, 'removeLayer');
        spyOn(component.map, 'resize');

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Clean up and release all internal resources associated with this map
        component.map.remove();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('toggleSearchActive should toggle the state of searchActive', () => {
        expect(component.searchActive).toBe(false);
        component.toggleSearchActive();
        expect(component.searchActive).toBe(true);
    });

    it('toggleFilterActive should toggle the state of filterActive', () => {
        expect(component.filterActive).toBe(false);
        component.toggleFilterActive();
        expect(component.filterActive).toBe(true);
    });

    it('selectResult should update the map', () => {
        spyOn(component, 'getBodenrichtwertzonen');
        component.selectSearchResult(feature);
        expect(component.map.flyTo).toHaveBeenCalledTimes(1);
        expect(component.getBodenrichtwertzonen).toHaveBeenCalledTimes(1);
    });

    it('getBodenrichtwertzonen should call BodenrichtwertService', () => {
        spyOn(component.bodenrichtwertService, 'getFeatureByLatLonEntw').and.callThrough();
        component.getBodenrichtwertzonen(lat, lon, entw);
        expect(component.bodenrichtwertService.getFeatureByLatLonEntw).toHaveBeenCalledTimes(1);
    });

    it('getAddressFromLatLng should call GeosearchService', () => {
        spyOn(component.geosearchService, 'getAddressFromCoordinates').and.callThrough();
        component.getAddressFromLatLng(lat, lon);
        expect(component.geosearchService.getAddressFromCoordinates).toHaveBeenCalledTimes(1);
    });

    it('onMapClickEvent should process the event', () => {
        const event = {
            lngLat: {
                'lng': lon,
                'lat': lat
            }
        };
        spyOn(component, 'getBodenrichtwertzonen');
        spyOn(component, 'getAddressFromLatLng');
        component.onMapClickEvent(event);
        expect(component.map.flyTo).toHaveBeenCalledTimes(1);
        expect(component.getBodenrichtwertzonen).toHaveBeenCalledTimes(1);
        expect(component.getAddressFromLatLng).toHaveBeenCalledTimes(1);
    });

    it('onSearchSelect should update the map', () => {
        spyOn(component, 'getBodenrichtwertzonen');
        component.onSearchSelect(feature);
        expect(component.map.flyTo).toHaveBeenCalledTimes(1);
        expect(component.getBodenrichtwertzonen).toHaveBeenCalledTimes(1);
    });

    it('toggle3dView should toggle the state of threeDActive', () => {
        expect(component.threeDActive).toBe(false);
        component.toggle3dView();
        expect(component.threeDActive).toBe(true);
        component.toggle3dView();
        expect(component.threeDActive).toBe(false);
        expect(component.map.addLayer).toHaveBeenCalledTimes(1);
        expect(component.map.removeLayer).toHaveBeenCalledTimes(1);
    });

    it('onStichtagChange should update the Stichtag attribute', () => {
        const stichtag = '2018-12-31';
        component.onStichtagChange(stichtag);
        expect(component.stichtag).toEqual(stichtag);
    });

    it('onTeilmarktChange should update the Teilmarkt attribute and call getBodenrichtwertzonen', () => {
        const teilmarkt = {
            'value': 'LF',
            'viewValue': 'Landwirtschaft'
        };
        spyOn(component, 'getBodenrichtwertzonen');
        component.onTeilmarktChange(teilmarkt);
        expect(component.teilmarkt).toEqual(teilmarkt);
        expect(component.getBodenrichtwertzonen).toHaveBeenCalledTimes(1);
    });

    it('resetMap should reset the map', () => {
        component.threeDActive = true;
        component.resetMap();
        expect(component.map.resize).toHaveBeenCalledTimes(1);
        expect(component.map.fitBounds).toHaveBeenCalledTimes(1);
    });

    it('enableLocationTracking should get the current position', () => {
        spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
            const position = {
                coords: {
                    latitude: lat,
                    longitude: lon
                }
            };
            arguments[0](position);
        });
        spyOn(component, 'getAddressFromLatLng');
        spyOn(component, 'getBodenrichtwertzonen');
        component.enableLocationTracking();
        expect(component.map.easeTo).toHaveBeenCalledTimes(1);
        expect(component.getAddressFromLatLng).toHaveBeenCalledTimes(1);
        expect(component.getBodenrichtwertzonen).toHaveBeenCalledTimes(1);
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
