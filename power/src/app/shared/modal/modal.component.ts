import { Component, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'power-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnDestroy {
    @ViewChild('mymodal') public div: ElementRef;
    @Output() public closing: EventEmitter<void> = new EventEmitter();
    public focusedElement: any;
    public isOpen = false;
    public title = '';

    constructor() { }

    ngOnDestroy() {
        if (this.isOpen) {
            this.close();
        }
    }

    @HostListener('document:keyup.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        /* istanbul ignore next */
        if (document.getElementsByClassName('modal-backdrop').length !== 0) {
            return;
        }
        if (this.isOpen) {
            event.stopPropagation();
            this.close();
        }
    }

    /**
     * Opens modal
     * @param title Title to display
     */
    public open(title?: string) {
        // open modal
        this.title = title;
        this.isOpen = true;
        document.body.classList.add('overflow-hidden');
        this.div.nativeElement.style.display = 'block';

        // focus
        this.focusedElement = document.activeElement;
        this.div.nativeElement.children[2].focus();
    }

    /**
     * Closes modal
     */
    public close() {
        if (!this.isOpen) {
            return;
        }

        // close callback
        this.closing.emit();

        // close modal
        this.isOpen = false;
        document.body.classList.remove('overflow-hidden');
        this.div.nativeElement.style.display = 'none';

        // focus
        if (this.focusedElement) {
            this.focusedElement.focus();
        }
    }

    /**
     * Toggles modal
     * @param title Title to display
     */
    public toggle(title?: string) {
        if (this.isOpen) {
            this.close();
        } else {
            this.open(title);
        }
    }

    /**
     * Returns true if modal is visible
     */
    public isVisible(): boolean {
        return this.isOpen;
    }
}
