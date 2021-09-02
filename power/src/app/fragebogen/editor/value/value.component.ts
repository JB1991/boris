import {
    Component, OnChanges, Input, Output, EventEmitter,
    InjectionToken, Inject, ChangeDetectionStrategy
} from '@angular/core';

import { Bootstrap4_CSS } from '@app/fragebogen/surveyjs/style';

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
    selector: 'power-forms-editor-value',
    templateUrl: './value.component.html',
    styleUrls: ['./value.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueComponent implements OnChanges {
    @Input() public model: any;
    @Input() public question: any;
    @Input() public value: any;
    @Output() public valueChange = new EventEmitter<any>();
    public data: any = {};
    public css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) {
        // overwrite style class
        this.css_style.root = 'sv_main sv_bootstrap_css bg-white';
        this.css_style.container = '';
        this.css_style.row = 'sv_row';
        this.css_style.page.root = '';
        this.css_style.question.header = 'd-none';
        this.css_style.question.formGroup = 'd-none';
    }

    /** @inheritdoc */
    public ngOnChanges(): void {
        this.data[this.question.name] = this.value;
    }

    /**
     * Updates values
     * @param data data
     */
    public updateValue(data: any): void {
        this.value = data[this.question.name];
        this.data[this.question.name] = this.value;
        this.valueChange.emit(this.value);
    }

    /**
     * Resets value
     */
    public resetValue(): void {
        this.value = undefined;
        this.data = {};
        this.valueChange.emit(this.value);
    }
}
