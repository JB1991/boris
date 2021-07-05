import {
    Component, OnInit, OnChanges, Input, Output, EventEmitter,
    SimpleChanges, InjectionToken, Inject, ChangeDetectionStrategy
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
    selector: 'power-forms-editor-conditions',
    templateUrl: './conditions.component.html',
    styleUrls: ['./conditions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionsComponent implements OnInit, OnChanges {
    @Input() public model: any;
    @Input() public data: any;
    @Output() public dataChange = new EventEmitter<any>();

    public struct = [];
    public questions = [];

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) { }

    ngOnInit(): void {
        // make question list
        this.questions = [];
        for (let i = 0; i < this.model.pages.length; i++) {
            for (const element of this.model.pages[i].elements) {
                // add to list
                if (element.type === 'matrix') {
                    for (const q of element.rows) {
                        this.questions.push({
                            name: element.name + '.' + q.value,
                            title: q.text.default ? q.text.default : '',
                            type: element.type,
                            choices: element.columns
                        });
                    }
                } else {
                    this.questions.push({
                        name: element.name,
                        title: element.title.default ? element.title.default : '',
                        type: element.type,
                        choices: element.choices
                    });
                }
            }
        }
        this.loadChoices(null);
    }

    /* eslint-disable-next-line complexity */
    ngOnChanges(changes: SimpleChanges): void {
        // check if data exists
        if (!this.data || this.struct.length > 0) {
            this.loadChoices(null);
            return;
        }

        // convert condition to form
        this.struct = [];
        const regex = /[^\s\[\]]+|\[([^\[\]]*)\]/gm; // /[^\s"']+|"([^"]*)"|'([^']*)'/gm;
        const split = this.data.match(regex);

        for (let i = 0; i < split.length; i++) {
            const tmp = {
                condition: '',
                question: '',
                operator: '',
                value: null,
                choices: null
            };

            // get condition
            if (split[i] === 'and' || split[i] === 'or') {
                tmp.condition = split[i];
                i++;
            }

            // get question
            tmp.question = this.parseValue(split[i]);
            if (tmp.question.startsWith('\'') && tmp.question.endsWith('\'')) {
                tmp.question = split[i].substring(1, split[i].length - 1);
            }
            i++;

            // get operator
            tmp.operator = split[i];

            // check if has data
            if (split.length > i + 1 && !(split[i + 1] === 'and' || split[i + 1] === 'or')) {
                // get data
                i++;
                tmp.value = split[i].substring(1, split[i].length - 1);

                if (tmp.operator === 'anyof' || tmp.operator === 'allof') {
                    // list
                    tmp.value = [];
                    const tmp2 = split[i].substring(1, split[i].length - 1);
                    const regex2 = /[^\s',]+|'([^']*)'/gm;
                    for (const item of tmp2.match(regex2)) {
                        tmp.value.push(item.substring(1, item.length - 1));
                    }
                } else {
                    // value
                    tmp.value = this.parseValue(split[i]);
                }
            }
            this.struct.push(tmp);
        }
        this.loadChoices(null);
    }

    /**
     * Handles changes to forms
     * @param event Event
     */
    /* eslint-disable-next-line complexity */
    public modelChanged(event: Event): void {
        // convert form to condition object
        this.data = '';
        for (const item of this.struct) {
            if (!item.question) {
                continue;
            }
            if (this.data) {
                this.data += ' ';
            }

            // add condition
            if (item.condition) {
                this.data += item.condition + ' ';
            }

            // add question and operator
            this.data += this.parseValue(item.question) + ' ' + item.operator;

            // add values
            if (item.operator === 'empty' || item.operator === 'notempty') {
                // nothing
            } else if (item.operator === 'anyof' || item.operator === 'allof') {
                // array
                this.data += ' [';
                for (let i = 0; i < item.value.length; i++) {
                    this.data += '\'' + item.value[i] + '\'' + (i + 1 >= item.value.length ? '' : ',');
                }
                this.data += ']';
            } else {
                // value
                this.data += ' ' + this.parseValue(item.value);
            }
        }
        this.dataChange.emit(this.data);
    }

    /**
     * Converts value to surveyjs condition
     * @param val Value
     */
    /* eslint-disable-next-line complexity */
    public parseValue(val: any): string {
        if (typeof val === 'undefined' || val === null || val === '') {
            // undefined
            return '\'\'';
        } else if (val.startsWith('\'') && val.endsWith('\'')) {
            // quoted
            return val;
        } else if (typeof val === 'boolean' || val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {
            // boolean
            return val.toString();
        } else if (typeof val === 'number' || !isNaN(val)) {
            // number
            return val;
        } else if (val.startsWith('{')) {
            // variable
            return val;
        } else if (val.indexOf('({') >= 0) {
            // func
            return val;
        }

        // text with quotes
        return '\'' + val.toString() + '\'';
    }

    /**
     * Connects choices with element
     * @param event Event
     */
    public loadChoices(event: Event): void {
        for (const item of this.struct) {
            item.choices = null;

            for (const question of this.questions) {
                // check if question has choices
                if (!question.choices) {
                    continue;
                }

                // check if question matches rule
                if (item.question === '{' + question.name + '}') {
                    item.choices = question.choices;

                    if (!Array.isArray(item.value)) {
                        continue;
                    }

                    // remove values that do not exist anymore
                    skip: for (const val of item.value) {
                        for (let i = 0; i < item.choices.length; i++) {
                            if (val === item.choices[i].value) {
                                continue skip;
                            }
                        }

                        // delete
                        const index = item.value.indexOf(val);
                        if (index >= 0) {
                            item.value.splice(index, 1);
                        }
                    }
                }
            }
        }
    }

    /**
     * Switches value to/from string and array
     * @param event Event
     * @param i Number of condition
     */
    public switchValueType(event: Event, i: number): void {
        const target = event.target as HTMLInputElement;
        if (target.value === 'empty' || target.value === 'notempty') {
            this.struct[i].value = null;
        } else if (target.value === 'anyof' || target.value === 'allof') {
            if (typeof this.struct[i].value !== 'object' || this.struct[i].value === null) {
                this.struct[i].value = [];
            }
        } else {
            if (typeof this.struct[i].value !== 'string') {
                this.struct[i].value = '';
            }
        }
    }

    /**
     * Select or deselect choice
     * @param event Event
     * @param i Condition number
     * @param j Choice number
     */
    public selectedItems(event: Event, i: number, j: number): void {
        const index = this.struct[i].value.indexOf(this.struct[i].choices[j].value);

        // check if item is in list
        if (index !== -1) {
            this.struct[i].value.splice(index, 1);
        } else {
            this.struct[i].value.splice(this.struct[i].value.length, 0, this.struct[i].choices[j].value);
        }
        this.modelChanged(null);
    }

    /**
     * Adds entry to conditions
     */
    public ConditionAdd(): void {
        this.struct.splice(this.struct.length, 0, {
            condition: (this.struct.length === 0 ? '' : 'and'),
            question: '',
            operator: 'equal',
            value: null,
            choices: null,
        });
        this.modelChanged(null);
    }

    /**
     * Removes entry from conditions
     */
    public ConditionDel(): void {
        // check if condition exists
        if (this.struct.length === 0) {
            return;
        }

        this.struct.splice(this.struct.length - 1, 1);
        this.modelChanged(null);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
