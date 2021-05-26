import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { SimpleChange } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte.component';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { LngLat, Map, MapMouseEvent, Marker } from 'maplibre-gl';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Feature } from 'geojson';

describe('Bodenrichtwert.BodenrichtwertKarte.BodenrichtwertkarteComponent', () => {
    const feature: Feature = require('../../../testdata/bodenrichtwert/bodenrichtwert-karte-feature.json');

    const lat = 52.40729;
    const lng = 9.80205;

    let component: BodenrichtwertKarteComponent;
    let fixture: ComponentFixture<BodenrichtwertKarteComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertKarteComponent],
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                BsDropdownModule.forRoot(),
                SharedModule,
                RouterModule.forRoot([]),
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertKarteComponent);
        component = fixture.componentInstance;
        component.teilmarkt = {
            'value': [''],
            'text': '',
            'hexColor': ''
        };
        fixture.detectChanges();

        const map = new Map({
            container: 'map',
        });
        component.map = map;
        spyOn(component, 'loadMap').and.callFake(() => {
            component.map = map;
            component.map.addSource('geoserver_br_br', component.bremenSource);
            component.map.addSource('geoserver_nds_br', component.ndsSource);
            component.map.addSource('geoserver_nds_fst', component.ndsFstSource);
            component.map.addSource('geoserver_br_verg', component.ndsVergSource);
        });
        component.loadMap(map);
        component.marker = new Marker();
        component.marker.setLngLat([lng, lat]).addTo(component.map);
        component.latLng = new LngLat(lng, lat);
        spyOn(component.map, 'easeTo');
        spyOn(component.map, 'getZoom').and.callThrough();
        spyOn(component.marker, 'getLngLat').and.callThrough();
        spyOn(component, 'determineZoomFactor').and.callThrough();
        spyOn(component.map, 'getPitch');
        spyOn(component.latLngChange, 'emit');
    });

    afterEach(() => {
        // Clean up and release all internal resources associated with this map
        component.map.remove();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnChanges should work for changes', () => {
        component.resetMapFired = false;
        spyOn(component.map, 'resize');
        spyOn(component.marker, 'setLngLat').and.callThrough();
        spyOn(component, 'flyTo');
        spyOn(component, 'onResetMap');
        component.expanded = true;
        component.ngOnChanges({
            teilmarkt: new SimpleChange(true, false, false),
            stichtag: new SimpleChange(true, false, false),
            latLng: new SimpleChange(true, false, false),
            collapsed: new SimpleChange(true, false, false),
            expanded: new SimpleChange(false, true, false),
            resetMapFired: new SimpleChange(false, true, false)
        });
        expect(component.map.easeTo).toHaveBeenCalledTimes(2);
        expect(component.map.resize).toHaveBeenCalledTimes(2);
        expect(component.marker.setLngLat).toHaveBeenCalledTimes(1);
        expect(component.flyTo).toHaveBeenCalledTimes(2);

        component.resetMapFired = true;
        component.collapsed = true;
        component.ngOnChanges({
            collapsed: new SimpleChange(true, false, false),
            resetMapFired: new SimpleChange(false, true, false),
        });
        expect(component.onResetMap).toHaveBeenCalledTimes(2);
        expect(component.map.resize).toHaveBeenCalledTimes(3);
    });

    it('onZoomEnd should emit zoom factor of map', () => {
        spyOn(component.zoomChange, 'emit');
        component.onZoomEnd();
        expect(component.zoomChange.emit).toHaveBeenCalled();
        expect(component.map.getZoom).toHaveBeenCalled();
    });


    it('onPitchEnd should emit pitch factor of map', () => {
        spyOn(component.pitchChange, 'emit');
        component.onPitchEnd();
        expect(component.pitchChange.emit).toHaveBeenCalled();
        expect(component.map.getPitch).toHaveBeenCalled();
    });

    it('onRotate should emit pitch and bearing factor of map', () => {
        spyOn(component.pitchChange, 'emit');
        spyOn(component.bearingChange, 'emit');
        spyOn(component.map, 'getBearing');
        component.onRotate();
        expect(component.pitchChange.emit).toHaveBeenCalled();
        expect(component.map.getPitch).toHaveBeenCalled();
        expect(component.bearingChange.emit).toHaveBeenCalled();
        expect(component.map.getBearing).toHaveBeenCalled();
    });

    it('determineZoomFactor should set the zoom factor', () => {
        component.standardBaulandZoom = 15.1;
        component.standardLandZoom = 11;
        component.teilmarkt.text = 'Bauland';
        expect(component.determineZoomFactor()).toEqual(15.1);
        component.teilmarkt.text = 'LF';
        expect(component.determineZoomFactor()).toEqual(11);
    });

    it('flyTo should focus the map to specific coordinates', () => {
        spyOn(component.map, 'flyTo');
        component.flyTo();
        expect(component.map.flyTo).toHaveBeenCalledTimes(1);
    });

    it('onDragEnd should process the drag', () => {
        component.onDragEnd();
        expect(component.latLngChange.emit).toHaveBeenCalledTimes(1);
    });

    /* eslint object-shorthand: "error" */
    it('onMapClickEvent should process the event', () => {
        const center = new LngLat(component.map.getCenter().lng, component.map.getCenter().lat);
        const event: MapMouseEvent = {
            type: 'click',
            target: component.map,
            originalEvent: new MouseEvent('click'),
            point: component.map.project(center),
            lngLat: center,
            defaultPrevented: false,
            preventDefault() { }
        };
        component.onMapClickEvent(event);
        expect(component.latLngChange.emit).toHaveBeenCalledTimes(1);

        component.latLng = undefined;
        spyOn(component.zoomChange, 'emit');
        component.onMapClickEvent(event);
        expect(component.zoomChange.emit).toHaveBeenCalled();
    });

    it('onResetMap should reset the map', () => {
        component.map.addSource('openmaptiles', { 'type': 'geojson' });
        component.map.addLayer({ id: 'building-extrusion', type: 'fill-extrusion', source: 'openmaptiles' });
        spyOn(component.map, 'fitBounds');
        spyOn(component.resetMapFiredChange, 'emit');
        component.onResetMap();
        expect(component.marker.getLngLat().lat).toBe(0);
        expect(component.marker.getLngLat().lng).toBe(0);
        expect(component.map.fitBounds).toHaveBeenCalledTimes(1);
        expect(component.resetMapFiredChange.emit).toHaveBeenCalledTimes(1);
    });

    it('onMoveEnd should process the dynamic labelling', () => {
        component.map.addSource('landwirtschaftSource', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: feature.geometry
            }
        });
        spyOn(component.map, 'getSource').and.callThrough();
        spyOn(component, 'dynamicLabelling');
        component.teilmarkt.value = ['B'];
        component.onMoveEnd();
        expect(component.map.getSource).toHaveBeenCalledTimes(1);
        expect(component.map.getSource).toHaveBeenCalledWith('landwirtschaftSource');
        expect(component.dynamicLabelling).toHaveBeenCalledTimes(1);

        component.teilmarkt.value = ['LF'];
        component.map.addSource('baulandSource', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: feature.geometry
            }
        });
        component.onMoveEnd();
        expect(component.map.getSource).toHaveBeenCalledTimes(2);
        expect(component.map.getSource).toHaveBeenCalledWith('baulandSource');
        expect(component.dynamicLabelling).toHaveBeenCalledTimes(2);
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
