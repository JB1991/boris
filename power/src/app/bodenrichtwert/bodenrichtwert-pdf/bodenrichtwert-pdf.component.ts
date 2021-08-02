/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Feature, FeatureCollection } from 'geojson';
import { environment } from '@env/environment';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { BodenrichtwertKarteService } from '../bodenrichtwert-karte/bodenrichtwert-karte.service';
import { Teilmarkt } from '../bodenrichtwert-component/bodenrichtwert.component';
import { EntwicklungszustandPipe } from '../pipes/entwicklungszustand.pipe';
import { VerfahrensartPipe } from '../pipes/verfahrensart.pipe';
import { EntwicklungszusatzPipe } from '../pipes/entwicklungszusatz.pipe';
import { NutzungPipe } from '../pipes/nutzung.pipe';
import { BeitragPipe } from '../pipes/beitrag.pipe';
import { BauweisePipe } from '../pipes/bauweise.pipe';
import { BodenartPipe } from '../pipes/bodenart.pipe';
import { UmlautCorrectionPipe } from '../pipes/umlaut-correction.pipe';

@Component({
    selector: 'power-bodenrichtwert-pdf',
    templateUrl: './bodenrichtwert-pdf.component.html',
    styleUrls: ['./bodenrichtwert-pdf.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertPdfComponent {
    @Input() public address: Feature;
    @Input() public flurstueck: FeatureCollection;
    @Input() public stichtag: string;
    @Input() public teilmarkt: Teilmarkt;
    @Input() public features: FeatureCollection;
    public testMode = false;

    constructor(
        private mapService: BodenrichtwertKarteService,
        private decimalPipe: DecimalPipe,
        private datePipe: DatePipe,
        private entwicklungszustandPipe: EntwicklungszustandPipe,
        private verfahrensartPipe: VerfahrensartPipe,
        private entwicklungszusatzPipe: EntwicklungszusatzPipe,
        private beitragPipe: BeitragPipe,
        private nutzungPipe: NutzungPipe,
        private bauweisePipe: BauweisePipe,
        private bodenartPipe: BodenartPipe,
        private umlautCorrectionPipe: UmlautCorrectionPipe
    ) {
        /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
        (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
    }

    /**
     * Creates pdf
     * @returns True if successful
     */
    // eslint-disable-next-line complexity
    public async create(): Promise<boolean> {
        // pdf definition
        const docDefinition: any = {
            pageSize: 'A4', // 595.28, 841.89
            pageMargins: [43, 88, 28, 48],
            compress: true,
            info: {
                title: $localize`Auszug aus der Bodenrichtwertkarte`,
                author: $localize`Landesamt für Geoinformation und Landesvermessung Niedersachsen (LGLN)`
            },
            header: {
                columns: [
                    {
                        image: 'gaglogo',
                        width: 100,
                        link: 'https://www.gag.niedersachsen.de/'
                    },
                    {
                        text: this.features.features[0].properties.gabe.replace('Grundstückswerte', 'Grundstückswerte\n'),
                        width: '*',
                        fontSize: 16,
                        margin: [5, 0, 0, 0]
                    },
                    {
                        image: 'ndswappen',
                        width: 38,
                        alignment: 'right'
                    }
                ],
                margin: [43, 28, 28, 0]
            },
            footer: /* istanbul ignore next */ function (currentPage, pageCount) {
                return {
                    text: $localize`Seite` + ' ' + currentPage + ' ' + $localize`von` + ' ' + pageCount,
                    margin: [43, 0, 28, 28]
                };
            },
            content: [
                {
                    text: $localize`Auszug aus der Bodenrichtwertkarte`,
                    bold: true,
                    alignment: 'center',
                    fontSize: 16
                },
                {
                    text: '(' + $localize`Erstellt am` + ' ' + this.datePipe.transform(Date()) + ')',
                    bold: true,
                    alignment: 'center'
                },
                {
                    text: [
                        $localize`Bodenrichtwertkarte` + ' ' + this.teilmarkt.text + ' ' + $localize`auf der Grundlage der aktuellen amtlichen Geobasisdaten`,
                        '\n',
                        $localize`Stichtag` + ': ' + this.datePipe.transform(this.stichtag)
                    ],
                    margin: [0, 20, 0, 10]
                },
                {
                    text: [
                        (this.address ? $localize`Adresse` + ': ' + this.address.properties.text + '\n' : $localize`Bezeichnung der Bodenrichtswertzone` + ': ' + this.features.features[0].properties.brzname + '\n'),
                        $localize`Gemarkung` + ': ' + this.flurstueck.features[0].properties.gemarkungsnummer + ', ',
                        $localize`Flurnummer` + ': ' + this.flurstueck.features[0].properties.flurnummer + ', ',
                        $localize`Flurstück` + ': ' + this.flurstueck.features[0].properties.zaehler,
                        (this.flurstueck.features[0].properties.nenner ? '/' + this.flurstueck.features[0].properties.nenner : '') + '\n',
                    ],
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    image: this.mapService.getScreenshot(),
                                    alignment: 'center',
                                    fit: [520, 520],
                                    link: location.href,
                                    border: [true, true, true, true]
                                }
                            ]
                        ]
                    },
                    layout: {
                        defaultBorder: false,
                        paddingLeft: /* istanbul ignore next */ function (i, node) { return 0; },
                        paddingRight: /* istanbul ignore next */ function (i, node) { return 0; },
                        paddingTop: /* istanbul ignore next */ function (i, node) { return 0; },
                        paddingBottom: /* istanbul ignore next */ function (i, node) { return 0; },
                        hLineColor: /* istanbul ignore next */ function (i, node) { return 'gray'; },
                        vLineColor: /* istanbul ignore next */ function (i, node) { return 'gray'; },
                    },
                },
                {
                    image: 'pin',
                    width: 32,
                    alignment: 'center',
                    relativePosition: {
                        x: 0,
                        y: this.getMapIconOffset()
                    }
                },
                {
                    columns: [
                        {
                            text: $localize`Abbildung nicht maßstabsgetreu`,
                            width: 200,
                        },
                        {
                            text: '',
                            width: '*'
                        },
                        {
                            text: [
                                {
                                    text: $localize`© OpenMapTiles`,
                                    link: 'https://openmaptiles.org/'
                                },
                                ' ',
                                {
                                    text: $localize`© OpenStreetMap contributors`,
                                    link: 'https://www.openstreetmap.org/copyright'
                                }
                            ],
                            width: 300,
                            alignment: 'right'
                        }
                    ]
                },
                {
                    stack: this.getBRW(),
                    pageBreak: 'before'
                },
                {
                    stack: [
                        {
                            text: $localize`Die Inhalte der Bodenrichtwerte Auskunft und die Umrechnungstabellen können Sie auch online über diesen QR-Code oder Link einsehen` + ':'
                        },
                        {
                            qr: location.href,
                            fit: 150,
                            margin: [0, 5, 0, 5]
                        },
                        {
                            text: location.href,
                            link: location.href
                        }
                    ],
                    unbreakable: true,
                    margin: [0, 10, 0, 10]
                },
                {
                    stack: [
                        {
                            text: $localize`Erläuterungen zu der Bodenrichtwertkarte`,
                            bold: true,
                            fontSize: 16
                        },
                        {
                            text: $localize`Gesetzliche Bestimmungen`,
                            bold: true,
                            fontSize: 13,
                            margin: [0, 10, 0, 0]
                        },
                        {
                            text: $localize`Bodenrichtwerte werden gemäß § 193 Absatz 5 Baugesetzbuch (BauGB) vom zuständigen Gutachterausschuss für Grundstückswerte nach den Bestimmungen des BauGB und der Immobilienwertermittlungsverordnung (ImmoWertV) ermittelt. Die Bodenrichtwerte wurden zum oben angegebenen Stichtag ermittelt.`,
                            alignment: 'justify'
                        },
                        {
                            text: $localize`Begriffsdefinition`,
                            bold: true,
                            fontSize: 13,
                            margin: [0, 10, 0, 0]
                        },
                        {
                            text: [
                                $localize`Der Bodenrichtwert (§ 196 Absatz 1 BauGB) ist der durchschnittliche Lagewert des Bodens für die Mehrheit von Grundstücken innerhalb eines abgegrenzten Gebiets (Bodenrichtwertzone), die nach ihren Grundstücksmerkmalen, insbesondere nach Art und Maß der Nutzbarkeit weitgehend übereinstimmen und für die im Wesentlichen gleiche allgemeine Wertverhältnisse vorliegen. Er ist bezogen auf den Quadratmeter Grundstücksfläche eines Grundstücks mit den dargestellten Grundstücksmerkmalen (Bodenrichtwertgrundstück).`,
                                '\n',
                                $localize`Der Bodenrichtwert enthält keine Wertanteile für Aufwuchs, Gebäude, bauliche und sonstige Anlagen. Bei bebauten Grundstücken ist der Bodenrichtwert ermittelt worden, der sich ergeben würde, wenn der Boden unbebaut wäre (§ 196 Absatz 1 Satz 2 BauGB).`,
                                '\n',
                                $localize`Eventuelle Abweichungen eines einzelnen Grundstücks vom Bodenrichtwert hinsichtlich seiner Grundstücksmerkmale (zum Beispiel hinsichtlich des Erschließungszustands, des beitragsrechtlichen Zustands, der Art und des Maßes der baulichen Nutzung) sind bei der Ermittlung des Verkehrswerts des betreffenden Grundstücks zu berücksichtigen.`,
                                '\n',
                                $localize`Die Abgrenzung der Bodenrichtwertzone sowie die Festsetzung der Höhe des Bodenrichtwerts begründet keine Ansprüche zum Beispiel gegenüber den Trägern der Bauleitplanung, Baugenehmigungsbehörden oder Landwirtschaftsbehörden.`
                            ],
                            alignment: 'justify'
                        },
                        {
                            text: $localize`Darstellung`,
                            bold: true,
                            fontSize: 13,
                            margin: [0, 10, 0, 0]
                        },
                        {
                            text: $localize`Der Bodenrichtwert wird im Kartenausschnitt mit seiner Begrenzungslinie (Bodenrichtwertzone) sowie mit seinem Wert in Euro pro Quadratmeter dargestellt. Im anschließenden beschreibenden Teil zur Bodenrichtwertzone werden darüber hinaus alle wertbeeinflussenden Grundstücksmerkmale mit ihren Ausprägungen genannt.`,
                            alignment: 'justify'
                        },
                        {
                            text: $localize`Verwendung der Daten`,
                            bold: true,
                            fontSize: 13,
                            margin: [0, 10, 0, 0]
                        },
                        {
                            text: [
                                $localize`Die Bodenrichtwerte`,
                                {
                                    text: '[1] ',
                                    linkToDestination: 'GOTO1',
                                    sup: true
                                },
                                $localize`stehen gebührenfrei im Internet zur Verfügung. Für die Bodenrichtwerte gilt die Lizenz "Datenlizenz Deutschland – Namensnennung – Version 2.0" (dl-de/by-2-0). Der Lizenztext kann unter govdata.de`,
                                {
                                    text: '[2] ',
                                    linkToDestination: 'GOTO2',
                                    sup: true
                                },
                                $localize`eingesehen werden. Die Bodenrichtwertanwendung kann gemäß den Nutzungsbestimmungen der Datenlizenz Deutschland – Namensnennung – Version 2.0 unter Angabe der Quelle © Oberer Gutachterausschuss für Grundstückswerte Niedersachsen [Jahr] und der Lizenz mit Verweis auf den Lizenztext genutzt werden.`
                            ],
                            alignment: 'justify'
                        },
                        {
                            ol: [
                                {
                                    id: 'GOTO1',
                                    text: 'https://immobilienmarkt.niedersachsen.de/bodenrichtwerte',
                                    link: 'https://immobilienmarkt.niedersachsen.de/bodenrichtwerte'
                                },
                                {
                                    id: 'GOTO2',
                                    text: 'https://www.govdata.de/dl-de/by-2-0',
                                    link: 'https://www.govdata.de/dl-de/by-2-0'
                                },
                            ],
                            margin: [0, 10, 0, 0]
                        }
                    ],
                    pageBreak: 'before'
                }
            ],
            images: {
                ndswappen: 'data:image/png;base64,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',
                gaglogo: 'data:image/png;base64,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',
                pin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA+lJREFUeF7tmlnITlEUhh9jxkLmUi4QyZxEmblwYSxTXJArYwqZM4ZkuFByITcoXJjJEHFBSKQUoggZQogyZOrV+Uv+/+yzzzl7n/PVd1Z9d2uv9a53rb33Omt/1ShzqVbm8VMQUFRAmTNQbIEyL4DiECy2QLEFypyBYguUeQEUt0CxBTLeAjWBgcBIoDPQCmgBfAJeAM+A88AJ4E0W2LKqgAbAQmAe0NgisJ/AGWA5cMdCP7FKFgRMBbYCzROg/AXsBeYGVZLAhHmJTwJke1XwSwv8LjAKeJzW0P/rfREgu/uByQ4B60zoBzxyaNPbNajMr3YJNLB1H+gLfHBl20cFDAfOgjdyDwKTSpWA6sAtoJsFwHvBlfcSqAv0AoYCdSLW/g62wjULH5EqritgCrAvwutTYBZwqgq91sAWi7PjMjAoMjoLBdcEXACGGPxqDw8GXkVgWwesiNBp7+JAdEmAGpzXQK0Q4N+BrsADy8SoQkYYdBcA2yxsGVVcEjAeOGTwtguYGQOwyDJ1gaq2YTHsVanqkoBFwGYDIJX+pZiAdVB2DFmjamsZ014ldZcEbAfmGwA1A97GBHwYGBuyRreBPq7ULicWlwTsAaYbkOiMiNvAHAAmGmzqyvyWOHrHzcomYLEBTE/gdkywN4DeIWveA01i2vO6BZQpZSxM1BqviQFYs4LngJqrquRi0DjFMFlZ1eUWaAqoq9O+rEreAbq7lTkb2QHMMSiq2kyHro0P5/368WDaE+b8NDAa+BGBTjo6AMOyr4FJ26BCrAINU3JZAfKhxkVBmkT397QQ8DWA2UE7HNZQyfZRw+0QixDXBMjeTUAHnkm+BOfFOUDfBo2AHoC+JTpZRKCDUX5Si2sCbKsgDfAjwLg0Bv5d64MA2RfIMa5A/mNHlaNpsrPRmC8C2gBqY+s7JmEZsNGlTV8ECONSYINDsA+BLmk7v//x+CSgNnA1mPSk5UHXpgYgV9IaypIA+WoXjMgapgQet4u0duezAipAzAB2WyOqrKisK/tRzVMiF1kQIGCa5E5IgPAj0B14kmCt1ZKsCNDboKa4usJsRd/5aolP2i5IopcVAcLWAbgedH02WFcC620U0+hkSYBw6llcfXzYR05FLMeCXl9TH6+SNQEKZklEM6NBaH9fr8FZX4Nh2dsZMiHWPKFP8EcJr5mvMJ5HBci3PnU199c7YoV8BgYkGJulIiovAgS6XvA2qCdvPZro/V+PqplKngQoUI3R9FawNuJRxRspeROgwDTa/uotwgjDpUBAXrH/9VsQkCv9JeC8qIASSEKuEIoKyJX+EnBeVEAJJCFXCEUF5Ep/CTj/A3d2iUHyUH2kAAAAAElFTkSuQmCC'
            }
        };

        // create pdf
        /* istanbul ignore next */
        if (!this.testMode) {
            if (!environment.production) {
                pdfMake.createPdf(docDefinition).open();
            } else {
                pdfMake.createPdf(docDefinition).download('Bodenrichtwert_Auskunft_' + this.datePipe.transform(Date(), 'dd-MM-yyyy') + '_um_' + this.datePipe.transform(Date(), 'HH-mm-ss') + '.pdf');
            }
        }
        return true;
    }

    /**
     * Returns makepdf Array for BRWs
     * @returns makepdf Array
     */
    /* eslint-disable-next-line complexity */
    public getBRW(): any {
        const ret: any = [
            {
                text: $localize`Bodenrichtwertzonen`,
                bold: true,
                fontSize: 16,
                margin: [0, 0, 0, 10]
            },
        ];

        // for each brw
        for (const brw of this.features.features) {
            if (Date.parse(brw.properties.stag) === Date.parse(this.stichtag)) {
                const tmp: any = [
                    {
                        text: $localize`Bodenrichtwertzone` + ': ' + brw.properties.wnum + '\n',
                        bold: true
                    }
                ];

                // Bodenrichtwert (brz)
                if (this.teilmarkt.value.includes('B')) {
                    tmp.push($localize`Bodenrichtwert` + ': ' + this.decimalPipe.transform(brw.properties.brw, '1.0-1') + ' €/m²\n');
                } else if (this.teilmarkt.value.includes('LF')) {
                    tmp.push($localize`Bodenrichtwert` + ': ' + this.decimalPipe.transform(brw.properties.brw, '1.2-2') + ' €/m²\n');
                }

                // Entwicklungszustand (entw)
                tmp.push($localize`Entwicklungszustand` + ': ' + this.entwicklungszustandPipe.transform(brw.properties.entw) + '\n');

                // Entwicklungszustandzusatz (verf, verg)
                if (brw.properties.verg) {
                    tmp.push($localize`Verfahrensgrund` + ': ' + this.verfahrensartPipe.transform(brw.properties.verg) + '\n');
                }
                if (brw.properties.verf) {
                    tmp.push($localize`Entwicklungs- und Sanierungszusatz` + ': ' + this.entwicklungszusatzPipe.transform(brw.properties.verf) + '\n');
                }

                // Beitragsrechtlicher Zustand (beit)
                if (brw.properties.beit) {
                    tmp.push($localize`Beitrags- und abgabenrechtlicher Zustand` + ': ' + this.beitragPipe.transform(brw.properties.beit) + '\n');
                }

                // Nutzung - Art und Ergänzung (nuta, enuta)
                tmp.push($localize`Art der Nutzung` + ': ' + this.nutzungPipe.transform(brw.properties.nutzung) + '\n');

                // Bauweise oder Anbauart (bauw)
                if (brw.properties.bauw) {
                    tmp.push($localize`Bauweise` + ': ' + this.bauweisePipe.transform(brw.properties.bauw) + '\n');
                }

                // Maß der baulichen Nutzung (bmz, gez, grz, wgfz)
                if (brw.properties.bmz) {
                    tmp.push($localize`Baumassenzahl` + ': ' + this.decimalPipe.transform(brw.properties.bmz) + '\n');
                }
                if (brw.properties.gez) {
                    tmp.push($localize`Geschosszahl` + ': ' + this.decimalPipe.transform(brw.properties.gez) + '\n');
                }
                if (brw.properties.grz) {
                    tmp.push($localize`Grundflächenzahl` + ': ' + this.decimalPipe.transform(brw.properties.grz) + '\n');
                }
                if (brw.properties.wgfz) {
                    tmp.push($localize`Wertrelevante Geschossflächenzahl` + ': ' + this.decimalPipe.transform(brw.properties.wgfz) + '\n');
                }

                // Merkmale der Land- und forstwirtschaftlichen Flächen (acza, bod, grza)
                if (brw.properties.acza) {
                    tmp.push($localize`Ackerzahl` + ': ' + this.decimalPipe.transform(brw.properties.acza) + '\n');
                }
                if (brw.properties.bod) {
                    tmp.push($localize`Bodenart` + ': ' + this.bodenartPipe.transform(brw.properties.bod) + '\n');
                }
                if (brw.properties.grza) {
                    tmp.push($localize`Grünlandzahl` + ': ' + this.decimalPipe.transform(brw.properties.grza) + '\n');
                }

                // Angaben zum Grundstück (gbrei, flae, gtie, frei, bem)
                if (brw.properties.flae) {
                    tmp.push($localize`Grundstücksfläche` + ': ' + this.decimalPipe.transform(brw.properties.flae) + ' m²\n');
                }
                if (brw.properties.gbrei) {
                    tmp.push($localize`Grundstücksbreite` + ': ' + this.decimalPipe.transform(brw.properties.gbrei) + ' m\n');
                }
                if (brw.properties.gtie) {
                    tmp.push($localize`Grundstückstiefe` + ': ' + this.decimalPipe.transform(brw.properties.gtie) + ' m\n');
                }
                if (brw.properties.frei) {
                    tmp.push($localize`Landesspezifische Angaben` + ': ' + this.umlautCorrectionPipe.transform(brw.properties.frei) + '\n');
                }
                if (brw.properties.bem) {
                    tmp.push($localize`Bemerkung` + ': ' + brw.properties.bem + '\n');
                }

                // Umrechnungsdatei
                if (brw.properties.umrechnungstabellendatei) {
                    const path = brw.properties.umrechnungstabellendatei[0].dateiname.replace('http://boris.niedersachsen.de', '');
                    const newUrl = location.protocol + '//' + location.host + '/boris-umdatei' + path.substr(0, path.lastIndexOf('.')) + '.pdf';
                    tmp.push({
                        text: $localize`Umrechnungstabelle` + ': ' + newUrl,
                        link: newUrl
                    });
                }

                // add to array
                ret.push({
                    text: tmp,
                    margin: [0, 0, 0, 10]
                });
            }
        }

        // return array
        return ret;
    }

    /**
     * Returns y offset of map icon
     * @returns y offset
     */
    public getMapIconOffset(): number {
        const height = this.getRealImageHeight();
        if (height >= 515) {
            return -285;
        }
        return (Math.ceil(height / 2) * -1) - 32;
    }

    /**
     * Returns real height of image
     * @returns Height
     */
    public getRealImageHeight(): number {
        const x = this.mapService.getMapWidth();
        const y = this.mapService.getMapHeight();

        if (x > y) {
            return (y / x) * 515;
        }
        return 515;
    }
}
