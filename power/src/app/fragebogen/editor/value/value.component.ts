import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { Bootstrap4_CSS } from '@app/fragebogen/surveyjs/style';

@Component({
    selector: 'power-forms-editor-value',
    templateUrl: './value.component.html',
    styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnChanges {
    @Input() public question: any;
    @Input() public value: any;
    @Output() public valueChange = new EventEmitter<any>();
    public data = {};
    public css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));

    constructor() {
        // overwrite style class
        this.css_style.container = 'sv_container';
        this.css_style.row = 'sv_row';
        this.css_style.question.header = 'd-none';
        this.css_style.page.root = '';
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
}
