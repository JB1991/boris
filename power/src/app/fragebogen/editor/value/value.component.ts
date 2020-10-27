import {
    Component, OnChanges, Input, Output, EventEmitter,
    InjectionToken, Inject, ChangeDetectionStrategy
} from '@angular/core';
const clone = require('rfdc')();

import { Bootstrap4_CSS } from '@app/fragebogen/surveyjs/style';

const UNIQ_ID_TOKEN = new InjectionToken('ID');
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
    public data = {};
    public css_style = clone(Bootstrap4_CSS);

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) {
        // overwrite style class
        this.css_style.root = 'sv_main sv_bootstrap_css bg-white';
        this.css_style.container = '';
        this.css_style.row = 'sv_row';
        this.css_style.page.root = '';
        this.css_style.question.header = 'd-none';
        this.css_style.question.formGroup = 'd-none';
    }

    ngOnChanges() {
        this.data[this.question.name] = this.value;
    }

    /**
     * Updates values
     * @param data data
     */
    public updateValue(data: any) {
        this.value = data[this.question.name];
        this.data[this.question.name] = this.value;
        this.valueChange.emit(this.value);
    }

    /**
     * Resets value
     */
    public resetValue() {
        this.value = null;
        this.data = {};
        this.valueChange.emit(this.value);
    }
}
