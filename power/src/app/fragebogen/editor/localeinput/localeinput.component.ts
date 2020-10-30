import { Component, Input, Output, EventEmitter, Inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'power-forms-editor-localeinput',
    templateUrl: './localeinput.component.html',
    styleUrls: ['./localeinput.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocaleInputComponent {
    @Input() public required = false;
    @Input() public textarea = false;
    @Input() public maxlength = 5000;
    @Input() public placeholder = '';
    @Input() public describedby = '';
    @Input() public type = 'text';
    @Input() public eid: string;
    @Input() public locale: any;
    @Output() public localeChange = new EventEmitter<any>();
    public displayLang = 'default';

    constructor(@Inject(LOCALE_ID) public lang: string) {
        /* istanbul ignore else */
        if (lang !== 'de') {
            this.displayLang = lang;
        }
    }

    /**
     * Updates values
     * @param data data
     */
    public updateValue() {
        this.localeChange.emit(this.locale);
    }
}
