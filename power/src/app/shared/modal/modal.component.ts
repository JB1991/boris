import {
    Component, OnDestroy, ViewChild, ElementRef, Output, EventEmitter,
    HostListener, InjectionToken, Inject, Input, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

const UNIQ_ID_TOKEN = new InjectionToken('ID');
/* eslint-disable-next-line prefer-const */
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
    @ViewChild('mymodal') public div?: ElementRef;

    @Input() public checkInvalid = false;

    @Output() public closing: EventEmitter<boolean> = new EventEmitter();

    public focusedElement?: HTMLElement;

    public isOpen = false;

    public title = '';

    constructor(
        @Inject(UNIQ_ID_TOKEN) public uniqId: number,
        public cdr: ChangeDetectorRef
    ) { }

    /**
     * Handles escape key pressed event
     * @param event KeyboardEvent
     */
    @HostListener('document:keyup.escape', ['$event'])
    public onKeydownHandler(event: KeyboardEvent): void {
        /* istanbul ignore next */
        if (document.getElementsByClassName('modal-backdrop').length !== 0) {
            return;
        }
        if (this.isOpen) {
            event.stopPropagation();
            this.close();
        }
    }

    /** @inheritdoc */
    public ngOnDestroy(): void {
        if (this.isOpen) {
            this.close();
        }
    }

    /**
     * Opens modal
     * @param title Title to display
     */
    public open(title: string): void {
        // open modal
        this.title = title;
        this.isOpen = true;
        document.body.classList.add('overflow-hidden');
        if (this.div) {
            this.div.nativeElement.style.display = 'block';
        }
        this.cdr.detectChanges();

        // focus
        this.focusedElement = document.activeElement as HTMLElement;
        this.div?.nativeElement.children[2].focus();
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
        if (this.checkInvalid && this.div?.nativeElement.getElementsByClassName('is-invalid').length > 0) {
            this.closing.emit(false);
            return;
        }

        // close callback
        this.closing.emit(true);

        // close modal
        this.isOpen = false;
        document.body.classList.remove('overflow-hidden');
        if (this.div) {
            this.div.nativeElement.style.display = 'none';
        }
        this.cdr.detectChanges();

        // focus
        if (this.focusedElement) {
            this.focusedElement.focus();
        }
    }

    /* istanbul ignore next */
    /**
     * Set Viewport to the footer
     */
    public scrollToFooter(): void {
        const footer = document.getElementById('footer-' + this.uniqId);
        if (footer) {
            footer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
