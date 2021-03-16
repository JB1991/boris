import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { SimpleChange } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { LngLat, Map, MapMouseEvent, Marker, } from 'mapbox-gl';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Feature } from 'geojson';

describe('Bodenrichtwert.BodenrichtwertKarte.BodenrichtwertkarteComponent', () => {
    const feature: Feature = require('../../../assets/boden/bodenrichtwert-samples/bodenrichtwert-karte-feature.json');

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
                NgxMapboxGLModule,
                BsDropdownModule.forRoot(),
                SharedModule,
                RouterModule.forRoot([]),
            ]
        })
            .compileComponents();
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
        component.marker = new Marker();
        component.latLng = [lat, lng];
        component.loadMap(map);
        component.marker.setLngLat([lng, lat]).addTo(component.map);

        spyOn(component.map, 'easeTo');
        spyOn(component.map, 'getZoom').and.callThrough();
        spyOn(component.marker, 'getLngLat').and.callThrough();
        spyOn(component, 'determineZoomFactor').and.callThrough();
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
        spyOn(component, 'activate3dView');
        spyOn(component, 'deactivate3dView');
        spyOn(component, 'flyTo');
        spyOn(component, 'onResetMap');
        component.expanded = true;
        component.ngOnChanges({
            teilmarkt: new SimpleChange(true, false, false),
            stichtag: new SimpleChange(true, false, false),
            latLng: new SimpleChange(true, false, false),
            collapsed: new SimpleChange(true, false, false),
            expanded: new SimpleChange(false, true, false),
            threeDActive: new SimpleChange(false, true, false),
            resetMapFired: new SimpleChange(false, true, false)
        });
        expect(component.determineZoomFactor).toHaveBeenCalledTimes(1);
        expect(component.map.easeTo).toHaveBeenCalledTimes(2);
        expect(component.map.getZoom).toHaveBeenCalledTimes(1);
        expect(component.map.resize).toHaveBeenCalledTimes(2);
        expect(component.marker.setLngLat).toHaveBeenCalledTimes(1);
        expect(component.flyTo).toHaveBeenCalledTimes(2);
        expect(component.activate3dView).toHaveBeenCalledTimes(1);

        component.resetMapFired = true;
        component.collapsed = true;
        component.ngOnChanges({
            collapsed: new SimpleChange(true, false, false),
            resetMapFired: new SimpleChange(false, true, false),
            threeDActive: new SimpleChange(true, false, false)
        });
        expect(component.onResetMap).toHaveBeenCalledTimes(2);
        expect(component.deactivate3dView).toHaveBeenCalledTimes(1);
        expect(component.map.resize).toHaveBeenCalledTimes(3);
    });

    it('determineZoomFactor should set the zoom factor', () => {
        component.teilmarkt.text = 'Bauland';
        component.determineZoomFactor();
        expect(component.zoomFactor).toEqual(15.1);
        component.teilmarkt.text = 'LF';
        component.determineZoomFactor();
        expect(component.zoomFactor).toEqual(11);
    });

    it('flyTo should focus the map to specific coordinates', () => {
        spyOn(component.map, 'flyTo');
        component.flyTo(lat, lng);
        expect(component.determineZoomFactor).toHaveBeenCalledTimes(1);
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
    });

    it('onResetMap should reset the map', () => {
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

    it('activate3dView should activate the 3d view', () => {
        spyOn(component.map, 'setPaintProperty');
        spyOn(component.map, 'addLayer');
        component.activate3dView();
        expect(component.map.getZoom).toHaveBeenCalledTimes(1);
        expect(component.map.addLayer).toHaveBeenCalledTimes(1);
        expect(component.map.easeTo).toHaveBeenCalledTimes(1);
        expect(component.map.setPaintProperty).toHaveBeenCalledTimes(1);
        expect(component.marker.getLngLat).toHaveBeenCalledTimes(1);
    });

    it('deactivate3dView should deactivate the 3d view', () => {
        spyOn(component.map, 'removeLayer');
        component.deactivate3dView();
        expect(component.map.easeTo).toHaveBeenCalledTimes(1);
        expect(component.map.removeLayer).toHaveBeenCalledTimes(1);
        expect(component.marker.getLngLat).toHaveBeenCalledTimes(1);
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
