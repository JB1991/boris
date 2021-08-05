import {
    Component, OnDestroy, ViewChild, ElementRef, Output,
    EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'power-modalmini',
    templateUrl: './modalmini.component.html',
    styleUrls: ['./modalmini.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalminiComponent implements OnDestroy {
    @ViewChild('modalmini') public modal: ModalDirective;
    @ViewChild('mymodal') public div: ElementRef;
    @Input() public checkInvalid = false;
    @Input() public easyclose = true;
    @Output() public closing: EventEmitter<boolean> = new EventEmitter();
    public focusedElement: HTMLElement;
    public isOpen = false;
    public title = '';

    constructor(
        public modalService: BsModalService,
        public cdr: ChangeDetectorRef
    ) { }

    /** @inheritdoc */
    ngOnDestroy(): void {
        if (this.isOpen) {
            this.close();
        }
        this.div.nativeElement.remove();
    }

    /**
     * Opens modal
     * @param title Title to display
     */
    public open(title?: string): void {
        // open modal
        this.title = title;
        this.isOpen = true;
        this.modal.config.ignoreBackdropClick = !this.easyclose;
        this.modal.config.keyboard = this.easyclose;
        this.modal.show();
        document.body.appendChild(this.div.nativeElement);
        this.cdr.detectChanges();

        // focus
        this.focusedElement = document.activeElement as HTMLElement;
        this.div.nativeElement.children[2].focus();
    }

    /**
     * Closes modal
     */
    public close(): void {
        if (!this.isOpen) {
            return;
        }

        // dont close if invalid inputs exists
        /* istanbul ignore next */
        if (this.checkInvalid && this.div.nativeElement.getElementsByClassName('is-invalid').length > 0) {
            this.closing.emit(false);
            return;
        }

        // close callback
        this.closing.emit(true);

        // close modal
        this.isOpen = false;
        this.modal.hide();
        this.cdr.detectChanges();

        // focus
        if (this.focusedElement) {
            this.focusedElement.focus();
        }
    }

    /**
     * Toggles modal
     * @param title Title to display
     */
    public toggle(title?: string): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open(title);
        }
    }

    /**
     * Returns visibility state
     * @returns True if modal is visible
     */
    public isVisible(): boolean {
        return this.isOpen;
    }
}
