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
            pageMargins: [40, 70, 40, 60],
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
                        text: this.features.features[0].properties.gabe,
                        width: 300,
                        fontSize: 16,
                        margin: [5, 0, 0, 0]
                    },
                    {
                        text: '',
                        width: '*'
                    },
                    {
                        image: 'ndswappen',
                        width: 30,
                        alignment: 'right'
                    }
                ],
                margin: [40, 20, 40, 20]
            },
            footer: /* istanbul ignore next */ function (currentPage, pageCount) {
                return {
                    text: $localize`Seite` + ' ' + currentPage + ' ' + $localize`von` + ' ' + pageCount,
                    margin: [40, 20, 40, 20]
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
                    margin: [0, 20, 0, 20]
                },
                {
                    text: [
                        $localize`Adresse` + ': ' + (this.address ? this.address.properties.text : $localize`Keine Adresse gefunden`) + '\n',
                        $localize`Gemarkung` + ': ' + this.flurstueck.features[0].properties.gemarkungsnummer + ', ',
                        $localize`Flurnummer` + ': ' + this.flurstueck.features[0].properties.flurnummer + ', ',
                        $localize`Flurstück` + ': ' + this.flurstueck.features[0].properties.zaehler,
                        (this.flurstueck.features[0].properties.nenner ? '/' + this.flurstueck.features[0].properties.nenner : '') + '\n',
                    ],
                    margin: [0, 0, 0, 20]
                },
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    image: this.mapService.getScreenshot(),
                                    alignment: 'center',
                                    fit: [515, 515],
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
                    stack: this.getBRW(),
                    pageBreak: 'before'
                },
                {
                    stack: [
                        {
                            text: $localize`Die Inhalte der Bodenrichtwerte Auskunft können Sie auch online über diesen QR-Code oder Link einsehen:`
                        },
                        {
                            qr: location.href,
                            fit: 200,
                            margin: [0, 10, 0, 10]
                        },
                        {
                            text: location.href,
                            link: location.href
                        }
                    ],
                    unbreakable: true,
                    margin: [0, 20, 0, 20]
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
                            margin: [0, 20, 0, 0]
                        },
                        {
                            text: $localize`Bodenrichtwerte werden gemäß § 193 Absatz 5 BauGB vom zuständigen Gutachterausschuss für Grundstückswerte nach den Bestimmungen des BauGB und der ImmoWertV ermittelt. Die Bodenrichtwerte wurden zum oben angegebenen Stichtag ermittelt.`,
                            alignment: 'justify'
                        },
                        {
                            text: $localize`Begriffsdefinition`,
                            bold: true,
                            fontSize: 13,
                            margin: [0, 20, 0, 0]
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
                            margin: [0, 20, 0, 0]
                        },
                        {
                            text: $localize`Der Bodenrichtwert wird mit seiner Begrenzungslinie (Bodenrichtwertzone) sowie mit seinen wertbeeinflussenden Grundstücksmerkmalen dargestellt.`,
                            alignment: 'justify'
                        },
                        {
                            text: $localize`Hinweis`,
                            bold: true,
                            fontSize: 13,
                            margin: [0, 20, 0, 0]
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
                lglnlogo: 'data:image/png;base64,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'
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
                margin: [0, 0, 0, 20]
            },
        ];

        // for each brw
        for (const brw of this.features.features) {
            if (this.datePipe.transform(brw.properties.stag) === this.datePipe.transform(this.stichtag)) {
                console.log(brw);
                const tmp: any = [
                    {
                        text: $localize`Bodenrichtwertzone` + ': ' + brw.properties.wnum + '\n\n',
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

                // add to array
                ret.push({
                    text: tmp,
                    margin: [0, 0, 0, 20]
                });
            }
        }

        // return array
        return ret;
    }
}
