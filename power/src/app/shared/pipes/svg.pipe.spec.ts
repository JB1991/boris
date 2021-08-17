import { TestBed, inject } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { SvgPipe } from './svg.pipe';

describe('Shared.SvgPipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule
            ]
        });
    });

    it('transforms data', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
        const pip = new SvgPipe(domSanitizer);
        const value = pip.transform('abc');
        expect(value).toEqual(domSanitizer.bypassSecurityTrustHtml('abc'));
    }));
});
