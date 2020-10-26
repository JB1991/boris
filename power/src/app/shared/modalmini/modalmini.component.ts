import { Component, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'power-modalmini',
    templateUrl: './modalmini.component.html',
    styleUrls: ['./modalmini.component.scss']
})
export class ModalminiComponent implements OnDestroy {
    @ViewChild('modalmini') public modal: ModalDirective;
    @ViewChild('mymodal') public div: ElementRef;
    @Input() public checkInvalid = false;
    @Output() public closing: EventEmitter<boolean> = new EventEmitter();
    public focusedElement: any;
    public isOpen = false;
    public title = '';

    constructor(public modalService: BsModalService) { }

    ngOnDestroy() {
        if (this.isOpen) {
            this.close();
        }
        this.div.nativeElement.remove();
    }

    /**
     * Opens modal
     * @param title Title to display
     */
    public open(title?: string) {
        // open modal
        this.title = title;
        this.isOpen = true;
        this.modal.show();
        document.body.appendChild(this.div.nativeElement);

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

        // dont close if invalid inputs exists
        if (this.checkInvalid && this.div.nativeElement.getElementsByClassName('is-invalid').length > 0) {
            this.closing.emit(false);
            return;
        }

        // close callback
        this.closing.emit(true);

        // close modal
        this.isOpen = false;
        this.modal.hide();

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
