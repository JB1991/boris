import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';

import { GmbComponent } from './gmb.component';
import { ElementRef } from '@angular/core';

/* eslint-disable max-lines */
describe('GmbComponent', () => {
    let component: GmbComponent;
    let fixture: ComponentFixture<GmbComponent>;

    const location = {
        'replaceState': jasmine.createSpy()
    };

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            declarations: [GmbComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        data: of({
                            'mode': 'gmb'
                        }),
                        queryParams: of({
                            'landkreis': 'Lüneburg',
                            'berichte': 'Lüneburg_2006'
                        })
                    }
                },
                { provide: Location, useValue: location }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GmbComponent);
        component = fixture.componentInstance;

        component.isBrowser = false;
        fixture.detectChanges();
    });

    it('should create', () => {
        spyOn(component, 'loadGeoMap');
        expect(component).toBeTruthy();
        expect(component.seo.getTitle()).toEqual('Grundstücksmarktberichte - Immobilienmarkt.NI');
    });

    it('should set title for lmb', () => {
        spyOn(component, 'loadGeoMap');
        component.mode = 'lmb';
        component.changeTitle();
        expect(component.seo.getTitle()).toEqual('Landesgrundstücksmarktberichte - Immobilienmarkt.NI');
    });

    it('should format tooltop', () => {
        spyOn(component, 'loadGeoMap');
        expect((component.myMapOptions?.tooltip as any).formatter({ name: '034620000' }))
            .toEqual('Wittmund');

        expect((component.myMapOptions?.tooltip as any).formatter({ name: 'Toast' }))
            .toEqual('Toast');
    });

    it('should resize', () => {
        spyOn(component, 'loadGeoMap');
        component.resize();
        expect(component.map).toBeUndefined();

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        component.map = { resize: () => { } } as any;
        if (component.map) {
            spyOn(component.map, 'resize');
            component.resize();
            expect(component.map.resize).toHaveBeenCalledTimes(1);
        }
    });

    it('should load gmb', () => {
        component.isBrowser = true;
        component.mode = 'gmb';
        component.echartsMap = new ElementRef(document.createElement('div'));
        spyOn(component.http, 'get').and.returnValue(of({
            'type': 'FeatureCollection',
            'name': 'bks_vereinfacht2',
            'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:EPSG::25832' } },
            'features': []
        }));
        component.ngOnInit();
        component.ngAfterViewInit();
        if (component.map) {
            spyOn(component.map, 'setOption');
        }
        expect(component.map).not.toBeUndefined();
    });

    it('should load lmb', () => {
        spyOn(component, 'loadGeoMap');
        component.mode = 'lmb';
        component.filterBerichte(true);
        expect(component.berichteFiltered[0].name).toEqual('Niedersachsen');
    });

    it('should not filter berichte', () => {
        spyOn(component, 'loadGeoMap');
        component.selectedKreis = undefined;
        component.filterBerichte();
        expect(component.berichteFiltered.length).toEqual(0);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
