import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[powerHideDropdownMenu]'
})
export class HideDropdownMenuDirective {
    @Input() public dropdownToggler?: Element;

    @Input() public ngbCollapseRef: any;

    constructor(
        private el: ElementRef
    ) { }

    /**
     * onWindowClicked
     * @param clickedEl html element
     */
    @HostListener('window:click', ['$event.target'])
    public onWindowClicked(clickedEl: HTMLElement): void {
        if (!this.el.nativeElement.contains(clickedEl) && !this.dropdownToggler?.contains(clickedEl)) {
            this.ngbCollapseRef.toggle(false);
        }
    }

    /**
     * onWindowResize
     */
    @HostListener('window:resize')
    public onWindowResize(): void {
        this.ngbCollapseRef.toggle(false);
    }
}
