/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { environment } from '@env/environment';

@Component({
    selector: 'power-bodenrichtwert-pdf',
    templateUrl: './bodenrichtwert-pdf.component.html',
    styleUrls: ['./bodenrichtwert-pdf.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertPdfComponent {
    public testMode = false;

    constructor(
        private decimalPipe: DecimalPipe,
        private datePipe: DatePipe,
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
                        text: $localize`Landesamt für Geoinformation\nund Landesvermessung Niedersachsen`,
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
            content: [],
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
}
