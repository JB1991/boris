import { TestBed, inject } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'

import { SvgPipe } from './svg.pipe';

describe('Fragebogen.Editor.SvgPipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule
            ]
        });
    });

    it('create an instance', () => {
        const pip = new SvgPipe(null);
        expect(pip).toBeTruthy();
    });

    it('transforms data', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
        const pip = new SvgPipe(domSanitizer);
        const value = pip.transform('abc');
        expect(value).toEqual(domSanitizer.bypassSecurityTrustHtml('abc'));
    }));
});
