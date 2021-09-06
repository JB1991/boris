import {
    Component, OnInit, OnChanges, Input, Output, EventEmitter,
    SimpleChanges, InjectionToken, Inject, ChangeDetectionStrategy
} from '@angular/core';

const UNIQ_ID_TOKEN = new InjectionToken('ID');
/* eslint-disable-next-line prefer-const */
let id = 0;
/* eslint-disable max-lines */
@Component({
    providers: [
        {
            provide: UNIQ_ID_TOKEN,
            useFactory: () => id++
        }
    ],
    selector: 'power-forms-editor-validators',
    templateUrl: './validators.component.html',
    styleUrls: ['./validators.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidatorsComponent implements OnInit, OnChanges {
    @Input() public model: any;
    @Input() public data: any;
    @Output() public dataChange = new EventEmitter<any>();

    public struct = new Array<any>();
    public questions = new Array<any>();

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) { }

    /** @inheritdoc */
    public ngOnInit(): void {
        // make question list
        this.questions = new Array<any>();
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
        this.loadChoices();
    }

    /** @inheritdoc */
    public ngOnChanges(changes: SimpleChanges): void { // eslint-disable-line complexity
        // check if data exists
        if (!this.data || !this.data.validators || this.struct.length > 0) {
            this.loadChoices();
            return;
        }

        // convert validator object to form
        this.struct = [];
        for (const validator of this.data.validators) {
            let data;
            switch (validator.type) {
                case 'numeric':
                    data = {
                        type: validator.type,
                        min: validator.minValue,
                        max: validator.maxValue
                    };
                    break;
                case 'answercount':
                    data = {
                        type: validator.type,
                        min: validator.minCount,
                        max: validator.maxCount
                    };
                    break;
                case 'text':
                    data = {
                        type: validator.type,
                        min: validator.minLength,
                        max: validator.maxLength,
                        allowDigits: validator.allowDigits
                    };
                    break;
                case 'email':
                    data = {
                        type: validator.type
                    };
                    break;
                case 'regex':
                    data = {
                        type: validator.type,
                        regex: validator.regex,
                        text: validator.text
                    };
                    break;
                case 'expression': {
                    data = {
                        type: validator.type,
                        expression: validator.expression,
                        question: '',
                        operator: '',
                        value: '',
                        choices: null
                    } as any;
                    // eslint-disable-next-line no-useless-escape
                    const regex = /[^\s\[\]]+|\[([^\[\]]*)\]/gm;
                    const split = validator.expression.match(regex);

                    // get question
                    data.question = this.parseValue(split[0]);
                    if (data.question.startsWith('\'') && data.question.endsWith('\'')) {
                        data.question = split[0].substring(1, split[0].length - 1);
                    }

                    // get operator
                    data.operator = split[1];

                    // check if has data
                    if (split.length > 2) {
                        // get data
                        data.value = split[2].substring(1, split[2].length - 1);

                        if (data.operator === 'anyof' || data.operator === 'allof') {
                            // list
                            data.value = new Array<any>();
                            const tmp2 = split[2].substring(1, split[2].length - 1);
                            const regex2 = /[^\s',]+|'([^']*)'/gm;
                            for (const item of tmp2.match(regex2)) {
                                data.value.push(item.substring(1, item.length - 1));
                            }
                        } else {
                            // value
                            data.value = this.parseValue(split[2]);
                        }
                    }
                    break;
                }
                default:
                    throw new Error('Unkown validator type');
            }
            this.struct.push(data);
        }
        this.loadChoices();
    }

    /**
     * Handles changes to forms
     */
    public modelChanged(): void { // eslint-disable-line complexity
        // convert form to validator object
        this.data.validators = [];
        for (const item of this.struct) {
            let data;
            switch (item.type) {
                case 'numeric':
                    data = {
                        type: item.type,
                        minValue: item.min,
                        maxValue: item.max
                    };
                    break;
                case 'answercount':
                    data = {
                        type: item.type,
                        minCount: item.min,
                        maxCount: item.max
                    };
                    break;
                case 'text':
                    data = {
                        type: item.type,
                        minLength: item.min,
                        maxLength: item.max,
                        allowDigits: (item.allowDigits ? item.allowDigits : true)
                    };
                    break;
                case 'email':
                    data = {
                        type: item.type
                    };
                    break;
                case 'regex':
                    data = {
                        type: item.type,
                        regex: item.regex,
                        text: item.text
                    };
                    break;
                case 'expression':
                    data = {
                        type: item.type,
                        expression: ''
                    };

                    // add question and operator
                    data.expression = this.parseValue(item.question) + ' ' + item.operator;

                    // add values
                    if (item.operator === 'empty' || item.operator === 'notempty') {
                        // nothing
                    } else if (item.operator === 'anyof' || item.operator === 'allof') {
                        // array
                        data.expression += ' [';
                        for (let i = 0; i < item.value.length; i++) {
                            data.expression += '\'' + item.value[i] + '\'' + (i + 1 >= item.value.length ? '' : ',');
                        }
                        data.expression += ']';
                    } else {
                        // value
                        data.expression += ' ' + this.parseValue(item.value);
                    }
                    break;
                default:
                    throw new Error('Unkown validator type');
            }
            this.data.validators.push(data);
        }
        this.dataChange.emit(this.data);
        this.loadChoices();
    }

    /**
     * Converts value to surveyjs condition
     * @param val Value
     * @returns Surveyjs condition
     */
    public parseValue(val: any): string { // eslint-disable-line complexity
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
     * Switches type
     * @param event Event
     * @param i Number of validator
     */
    public switchType(event: Event, i: number): void {
        const target = event.target as HTMLInputElement;
        if (target.value === 'expression') {
            if (!this.struct[i].operator) {
                this.struct[i].question = '';
                this.struct[i].operator = 'equal';
                this.struct[i].value = '';
            }
        } else if (target.value === 'regex') {
            if (!this.struct[i].text) {
                this.struct[i].text = {};
            }
        }
    }

    /**
     * Connects choices with element
     */
    public loadChoices(): void {
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
        this.modelChanged();
    }

    /**
     * Adds entry to validators
     */
    public ValidatorAdd(): void {
        this.struct.splice(this.struct.length, 0, {
            type: 'numeric',
            min: null,
            max: null
        });
        this.modelChanged();
    }

    /**
     * Removes entry from validators
     */
    public ValidatorDel(): void {
        // check if condition exists
        if (this.struct.length === 0) {
            return;
        }

        this.struct.splice(this.struct.length - 1, 1);
        this.modelChanged();
    }

    /**
     * Adds predefined validator validator
     * @param event Event
     */
    public selectDefaultValidator(event: Event): void {
        switch ((event.target as HTMLSelectElement).value) {
            case 'date1':
                this.struct.splice(this.struct.length, 0, {
                    type: 'regex',
                    regex: '^(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)\\d{2})$',
                    text: {
                        default: 'Ihre Antwort entspricht nicht dem gefordertem Format \'yyyy-mm-dd\'.'
                    }
                });
                break;
            case 'date2':
                this.struct.splice(this.struct.length, 0, {
                    type: 'regex',
                    regex: '^((?:19|20)\\d{2})-(1[012]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])$',
                    text: {
                        default: 'Ihre Antwort entspricht nicht dem gefordertem Format \'dd.mm.yyyy\'.'
                    }
                });
                break;
            default:
                return;
        }

        // reset select
        (event.target as HTMLSelectElement).value = '';
        this.modelChanged();
    }

    /**
     * Validates if a regular expression compiles
     * @param regex Regular expression
     * @returns True if regex is invalid
     */
    public isRegExInvalid(regex: string): boolean {
        try {
            const re = new RegExp(regex);
            re.exec('Hallo Welt');
        } catch (error) {
            return true;
        }
        return false;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
