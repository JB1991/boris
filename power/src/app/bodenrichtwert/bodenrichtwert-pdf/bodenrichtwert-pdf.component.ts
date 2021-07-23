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
import { EinflussgroessePipe } from '../pipes/einflussgroesse.pipe';

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
                        image: 'lglnlogo',
                        width: 38
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
                            text: $localize`Bodenrichtwerte werden gemäß § 193 Absatz 5 BauGB vom zuständigen Gutachterausschuss für Grundstückswerte nach den Bestimmungen des BauGB und der ImmoWertV ermittelt. Die Bodenrichtwerte wurden zum oben angegebenen Stichtag ermittelt.`,
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
                                $localize`Der Bodenrichtwert (§ 196 Absatz 1 BauGB ) ist der durchschnittliche Lagewert des Bodens für die Mehrheit von Grundstücken innerhalb eines abgegrenzten Gebiets (Bodenrichtwertzone), die nach ihren Grundstücksmerkmalen, insbesondere nach Art und Maß der Nutzbarkeit weitgehend übereinstimmen und für die im Wesentlichen gleiche allgemeine Wertverhältnisse vorliegen. Er ist bezogen auf den Quadratmeter Grundstücksfläche eines Grundstücks mit den dargestellten Grundstücksmerkmalen (Bodenrichtwertgrundstück).`,
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
                            text: $localize`Der Bodenrichtwert wird mit seiner Begrenzungslinie (Bodenrichtwertzone) sowie mit seinen wertbeeinflussenden Grundstücksmerkmalen dargestellt.`,
                            alignment: 'justify'
                        },
                        {
                            text: $localize`Hinweis`,
                            bold: true,
                            fontSize: 13,
                            margin: [0, 10, 0, 0]
                        },
                        {
                            text: $localize`Diese Präsentation und die ihr zugrunde liegenden Angaben des amtlichen Vermessungswesens sind gesetzlich geschützt. Die Verwertung für nichteigene oder wirtschaftliche Zwecke und die öffentliche Wiedergabe sind nur mit Erlaubnis des Herausgebers gestattet.`,
                            alignment: 'justify'
                        }
                    ],
                    pageBreak: 'before'
                }
            ],
            images: {
                ndswappen: 'data:image/png;base64,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',
                lglnlogo: 'data:image/png;base64,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',
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
                    tmp.push($localize`Beitragsabgabenrechtlicher Zustand` + ': ' + this.beitragPipe.transform(brw.properties.beit) + '\n');
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
                    tmp.push($localize`Umrechnungstabelle` + ': ' + newUrl);
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
