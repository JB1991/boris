import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe, DecimalPipe } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { BodenrichtwertKarteService } from '../bodenrichtwert-karte/bodenrichtwert-karte.service';
import { EntwicklungszustandPipe } from '../pipes/entwicklungszustand.pipe';
import { VerfahrensartPipe } from '../pipes/verfahrensart.pipe';
import { EntwicklungszusatzPipe } from '../pipes/entwicklungszusatz.pipe';
import { NutzungPipe } from '../pipes/nutzung.pipe';
import { BeitragPipe } from '../pipes/beitrag.pipe';
import { BauweisePipe } from '../pipes/bauweise.pipe';
import { BodenartPipe } from '../pipes/bodenart.pipe';
import { UmlautCorrectionPipe } from '../pipes/umlaut-correction.pipe';
import { GemarkungPipe } from '@app/shared/pipes/gemarkung.pipe';

import { BodenrichtwertPdfComponent } from './bodenrichtwert-pdf.component';

describe('Bodenrichtwert.BodenrichtwertPdf.BodenrichtwertPdfComponent', () => {
    let component: BodenrichtwertPdfComponent;
    let fixture: ComponentFixture<BodenrichtwertPdfComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertPdfComponent
            ],
            imports: [
                HttpClientTestingModule,
                SharedModule
            ],
            providers: [
                BodenrichtwertKarteService,
                DatePipe,
                DecimalPipe,
                EntwicklungszustandPipe,
                VerfahrensartPipe,
                EntwicklungszusatzPipe,
                BeitragPipe,
                NutzungPipe,
                BauweisePipe,
                BodenartPipe,
                UmlautCorrectionPipe,
                GemarkungPipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BodenrichtwertPdfComponent);
        component = fixture.componentInstance;
        spyOn(component.mapService, 'getScreenshot').and.returnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create pdf', () => {
        spyOn(component.mapService, 'getMapWidth').and.returnValue(500);
        spyOn(component.mapService, 'getMapHeight').and.returnValue(500);
        component.address = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [9.7433832, 52.4134995]
            },
            properties: {
                text: 'Hanover 1 ABC'
            }
        };
        component.teilmarkt = {
            value: ['B'],
            text: 'Alpha',
            hexColor: '#000'
        };
        component.features = [
            {
                'type': 'Feature',
                'id': 'br_brzone_flat.fid-6d7007e2_17573bbcfb5_1102',
                'geometry': {} as any,
                'properties': {
                    'objectid': 6513030436152,
                    'objektidentifikator': 'DENIBR4313B36152',
                    'gesl': '032410010000',
                    'gena': 'Hannover. Landeshauptst.',
                    'gasl': '03043',
                    'gabe': 'Gutachterausschuss für Grundstückswerte Hameln-Hannover',
                    'genu': '033847',
                    'gema': 'Klein-Buchholz',
                    'ortst': null,
                    'wnum': '04306152',
                    'brw': 155,
                    'stag': '2012-12-31Z',
                    'brke': '1',
                    'bedw': null,
                    'plz': null,
                    'bas__basbe': 'AK5',
                    'bas__basma': 5000,
                    'entw': 'B',
                    'beit': '1',
                    'nutzung': [
                        {
                            'nutz': 'GE',
                            'enuta': [
                                ''
                            ]
                        }
                    ],
                    'bauw': 'o',
                    'gez': 'II',
                    'wgfz': 1,
                    'grz': 2,
                    'bmz': 3,
                    'flae': 50,
                    'gtie': 3,
                    'gbrei': 20,
                    'erve': null,
                    'bod': 'S',
                    'acza': 1,
                    'grza': 1,
                    'aufw': null,
                    'weer': null,
                    'bem': 'Toast',
                    'frei': 'Dienstleistung',
                    'brzname': 'Bothfeld Sutelstr.',
                    'verg': 'Entw',
                    'verf': 'SB',
                    'vernum': null,
                    'umrechnungstabellendatei': [
                        {
                            dateiname: 'abc'
                        }
                    ],
                    'umrechnungstabellenwerte': null,
                    'bbox': [
                        1090869.2097,
                        6873968.5752,
                        1091495.7346,
                        6874687.2328
                    ]
                }
            }
        ];
        component.flurstueck = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'id': 'ax_flurstueck_nds.2160785',
                    'geometry': {} as any,
                    'properties': {
                        'gml_id': 'DENIAL350000733t',
                        'identifier': 'urn:adv:oid:DENIAL350000733t',
                        'beginnt': '2018-02-20T06:20:24Z',
                        'advstandardmodell': 'DLKM',
                        'anlass': 50000,
                        'land': 3,
                        'gemarkungsnummer': 1205,
                        'zaehler': 113,
                        'nenner': 37,
                        'flurstueckskennzeichen': '031205005001130037__',
                        'amtlicheflaeche': 1262,
                        'amtlicheflaeche_uom': 'urn:adv:uom:m2',
                        'flurnummer': 5,
                        'abweichenderrechtszustand': false,
                        'zweifelhafterflurstuecksnachweis': false,
                        'rechtsbehelfsverfahren': false,
                        'zeitpunktderentstehung': '1974-01-01',
                        'gemeindezugehoerigkeit|ax_gemeindekennzeichen|land': 3,
                        'regierungsbezirk': 3,
                        'kreis': 59,
                        'gemeinde': 17,
                        'zustaendigestelle|ax_dienststelle_schluessel|land': 3,
                        'stelle': 2343
                    }
                }
            ]
        };
        component.testMode = true;

        // test pdf
        expect(component.create()).toBeTrue();
    });

    it('should create pdf', () => {
        spyOn(component.mapService, 'getMapWidth').and.returnValue(600);
        spyOn(component.mapService, 'getMapHeight').and.returnValue(400);
        component.teilmarkt = {
            value: ['LF'],
            text: 'Alpha',
            hexColor: '#000'
        };
        component.features = [
            {
                'type': 'Feature',
                'id': 'br_brzone_flat.fid-6d7007e2_17573bbcfb5_1102',
                'geometry': {} as any,
                'properties': {
                    'objectid': 6513030436152,
                    'objektidentifikator': 'DENIBR4313B36152',
                    'gesl': '032410010000',
                    'gena': 'Hannover. Landeshauptst.',
                    'gasl': '03043',
                    'gabe': 'Gutachterausschuss für Grundstückswerte in Bremen',
                    'genu': '033847',
                    'gema': 'Klein-Buchholz',
                    'ortst': null,
                    'wnum': '04306152',
                    'brw': 155,
                    'stag': '2012-12-31Z',
                    'brke': '1',
                    'bedw': null,
                    'plz': null,
                    'bas__basbe': 'AK5',
                    'bas__basma': 5000,
                    'entw': 'B',
                    'beit': null,
                    'nutzung': [
                        {
                            'nutz': 'GE',
                            'enuta': [
                                ''
                            ]
                        }
                    ],
                    'bauw': null,
                    'gez': null,
                    'wgfz': null,
                    'grz': null,
                    'bmz': null,
                    'flae': null,
                    'gtie': null,
                    'gbrei': null,
                    'erve': null,
                    'bod': null,
                    'acza': null,
                    'grza': null,
                    'aufw': null,
                    'weer': null,
                    'bem': null,
                    'frei': null,
                    'brzname': 'Bothfeld Sutelstr.',
                    'verg': null,
                    'verf': null,
                    'vernum': null,
                    'umrechnungstabellendatei': null,
                    'umrechnungstabellenwerte': null,
                    'bbox': [
                        1090869.2097,
                        6873968.5752,
                        1091495.7346,
                        6874687.2328
                    ]
                }
            }
        ];
        component.testMode = true;

        // test pdf
        expect(component.create()).toBeTrue();
    });
});
