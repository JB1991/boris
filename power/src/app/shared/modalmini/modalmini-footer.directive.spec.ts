import { ElementRef } from '@angular/core';

import { ModalminiFooterDirective } from './modalmini-footer.directive';

describe('Shared.ModalminiFooterDirective', () => {
    it('should create an instance', () => {
        const directive = new ModalminiFooterDirective(null);
        expect(directive).toBeTruthy();
    });

    it('should move footer', () => {
        // create element
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        div3.appendChild(div2);
        div2.appendChild(div1);
        const directive = new ModalminiFooterDirective(new ElementRef(div1));

        // test
        expect(div3.children.length).toEqual(1);
        expect(div2.children.length).toEqual(1);
        directive.ngOnInit();
        expect(div3.children.length).toEqual(2);
        expect(div2.children.length).toEqual(0);
    });
});
