import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BodenwertKalkulatorComponent } from './bodenwert-kalkulator.component';
import { CommonModule } from '@angular/common';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Map } from 'mapbox-gl';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlurstueckPipe } from '../flurstueck-pipe.pipe';
import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('BodenwertKalkulator.BodenwertKalkulator.BodenwertKalkulatorComponent', () => {
    const feature = require('../../../testdata/bodenwert/feature.json');
    const flurstueck = require('../../../testdata/bodenwert/flurstueck.json')[0];
    const style = require('../../../testdata/bodenwert/style.json');

    const lat = 52.40729;
    const lon = 9.80205;

    let component: BodenwertKalkulatorComponent;
    let fixture: ComponentFixture<BodenwertKalkulatorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                FlurstueckPipe,
                BodenwertKalkulatorComponent
            ],
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                NgxMapboxGLModule,
                SharedModule,
                CollapseModule
            ],
            providers: [
                AlertsService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenwertKalkulatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const map = new Map({
            container: 'map'
        });
        component.loadMap(map);

        spyOn(component.map, 'addLayer');
        spyOn(component.map, 'easeTo');
        spyOn(component.map, 'fitBounds');
        spyOn(component.map, 'flyTo');
        spyOn(component.map, 'getStyle').and.returnValue(style);
        spyOn(component.map, 'queryRenderedFeatures').and.returnValue([flurstueck.value]);
        spyOn(component.map, 'removeLayer');
        spyOn(component.map, 'resize');
        spyOn(component.map, 'setFilter');
        spyOn(component.map, 'setPaintProperty');
        spyOn(component.alerts, 'NewAlert');
    });

    afterEach(() => {
        // Clean up and release all internal resources associated with this map
        component.map.remove();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('onExpanded should resize map', () => {
        component.onExpanded();
        expect(component.map.resize).toHaveBeenCalledTimes(1);
    });

    it('onCollapsed should resize map', () => {
        component.onCollapsed();
        expect(component.map.resize).toHaveBeenCalledTimes(1);
    });

    it('onMapClickEvent should process the event', () => {
        spyOn(component.map, 'getZoom').and.returnValue(14);
        const event = {
            point: {
                'x': 566,
                'y': 376
            },
            lngLat: {
                lng: 9.706822,
                lat: 52.373787
            }
        };
        component.onMapClickEvent(event);
        expect(component.map.queryRenderedFeatures).toHaveBeenCalledTimes(1);
        expect(component.isCollapsed).toBeFalse();
    });

    it('onMapClickEvent should fire warning alert', () => {
        spyOn(component.map, 'getZoom').and.returnValue(13);
        const event = {
            point: {
                'x': 566,
                'y': 376
            },
            lngLat: {
                lng: 9.706822,
                lat: 52.373787
            }
        };
        component.onMapClickEvent(event);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert)
            .toHaveBeenCalledWith('warning', 'Auswahl fehlgeschlagen',
                'Zur Selektion von Flurstücken bitte weiter heranzoomen.');
    });

    it('updateFlurstueckSelection should add and delete a Flurstueck from the selection', () => {
        expect(component.flurstueckSelection.size).toBe(0);
        component.updateFlurstueckSelection(flurstueck.value);
        expect(component.flurstueckSelection.size).toBe(1);
        component.updateFlurstueckSelection(flurstueck.value);
        expect(component.flurstueckSelection.size).toBe(0);
    });

    it('updateFlurstueckHighlighting should call setFilter', () => {
        component.flurstueckSelection.set(flurstueck.key, flurstueck.value);
        component.updateFlurstueckHighlighting();
        expect(component.map.setFilter).toHaveBeenCalledTimes(2);
    });

    it('flyTo should update the map', () => {
        component.flyTo(feature);
        expect(component.map.flyTo).toHaveBeenCalledTimes(1);
    });

    it('toggle3dView should toggle the state of threeDActive', () => {
        expect(component.threeDActive).toBe(false);
        component.toggle3dView();
        expect(component.threeDActive).toBe(true);
        component.toggle3dView();
        expect(component.threeDActive).toBe(false);
        expect(component.map.easeTo).toHaveBeenCalledTimes(2);
        expect(component.map.setPaintProperty).toHaveBeenCalledTimes(2);
        expect(component.map.addLayer).toHaveBeenCalledTimes(1);
        expect(component.map.removeLayer).toHaveBeenCalledTimes(1);
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

    it('resetSelection should clear flurstueckSelection', () => {
        expect(component.flurstueckSelection.size).toBe(0);
        component.updateFlurstueckSelection(flurstueck.value);
        component.resetSelection();
        expect(component.flurstueckSelection.size).toBe(0);
        expect(component.isCollapsed).toBeTrue();
    });

    it('resetMap should reset the map', () => {
        component.threeDActive = true;
        component.resetMap();
        expect(component.map.resize).toHaveBeenCalledTimes(1);
        expect(component.map.fitBounds).toHaveBeenCalledTimes(1);
    });

    it('toggleLocationTracking should toggle the state of locationTrackingActive', () => {
        expect(component.locationTrackingActive).toBeFalse();
        component.toggleLocationTracking();
        expect(component.locationTrackingActive).toBeTrue();
        component.toggleLocationTracking();
        expect(component.locationTrackingActive).toBeFalse();
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
        component.enableLocationTracking();
        expect(component.map.easeTo).toHaveBeenCalledTimes(1);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
