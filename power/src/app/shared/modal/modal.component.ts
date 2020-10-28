import {
    Component, OnDestroy, ViewChild, ElementRef, Output, EventEmitter,
    HostListener, InjectionToken, Inject, Input, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

const UNIQ_ID_TOKEN = new InjectionToken('ID');
let id = 0;

@Component({
    providers: [
        {
            provide: UNIQ_ID_TOKEN,
            useFactory: () => id++
        }
    ],
    selector: 'power-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnDestroy {
    @ViewChild('mymodal') public div: ElementRef;
    @Input() public checkInvalid = false;
    @Output() public closing: EventEmitter<boolean> = new EventEmitter();
    public focusedElement: any;
    public isOpen = false;
    public title = '';

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number,
        public cdr: ChangeDetectorRef) { }

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
        this.cdr.detectChanges();

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
        document.body.classList.remove('overflow-hidden');
        this.div.nativeElement.style.display = 'none';
        this.cdr.detectChanges();

        // focus
        if (this.focusedElement) {
            this.focusedElement.focus();
        }
    }

    /**
     * Set Viewport to the footer
     */
    /* istanbul ignore next */
    public scrollToFooter() {
        const footer = document.getElementById('footer-' + this.uniqId);
        footer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
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
