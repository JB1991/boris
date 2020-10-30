import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
    selector: '[powerModalminiFooter]'
})
export class ModalminiFooterDirective implements OnInit {

    constructor(public el: ElementRef) { }

    ngOnInit() {
        this.el.nativeElement.parentElement.parentElement.appendChild(this.el.nativeElement);
    }
}
