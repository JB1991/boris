import {
    Component, OnInit, OnChanges, Input, Output, EventEmitter,
    SimpleChanges, InjectionToken, Inject, ChangeDetectionStrategy
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
    selector: 'power-forms-editor-conditions',
    templateUrl: './conditions.component.html',
    styleUrls: ['./conditions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionsComponent implements OnInit, OnChanges {
    @Input() public model: any;
    @Input() public data: any;
    @Output() public dataChange = new EventEmitter<any>();

    public struct = [];
    public questions = [];

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) { }

    ngOnInit() {
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

    ngOnChanges(changes: SimpleChanges) {
        // check if data exists
        if (!this.data || this.struct.length > 0) {
            this.loadChoices(null);
            return;
        }

        // convert condition to form
        this.struct = [];
        const split = this.data.split(' ');
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
            if (split[i].startsWith('{')) {
                tmp.question = split[i];
            } else {
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

                if (split[i].startsWith('[')) {
                    // list
                    const tmp2 = split[i].substring(1, split[i].length - 1);
                    tmp.value = [];
                    for (const item of tmp2.split(',')) {
                        tmp.value.push(item.substring(1, item.length - 1));
                    }
                } else if (split[i].startsWith('{')) {
                    // variable
                    tmp.value = split[i];
                } else if (split[i] === 'true' || split[i] === 'false') {
                    // boolean
                    tmp.value = split[i] === 'true';
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
    public modelChanged(event: Event) {
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
            if (item.question.startsWith('{')) {
                this.data += item.question + ' ' + item.operator;
            } else {
                this.data += '\'' + item.question + '\' ' + item.operator;
            }

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
                // check if value is set
                if (item.value === null) {
                    item.value = '';
                }

                if (typeof item.value === 'boolean') {
                    // boolean
                    this.data += ' ' + item.value;
                } else if (item.value.startsWith('{')) {
                    // variable
                    this.data += ' ' + item.value;
                } else {
                    // text
                    this.data += ' \'' + item.value + '\'';
                }
            }
        }
        this.dataChange.emit(this.data);
    }

    /**
     * Connects choices with element
     * @param event Event
     */
    public loadChoices(event: Event) {
        for (const item of this.struct) {
            item.choices = null;
            for (const question of this.questions) {
                if (item.question === '{' + question.name + '}') {
                    item.choices = question.choices;
                }
            }
        }
    }

    /**
     * Switches value to/from string and array
     * @param event Event
     * @param i Number of condition
     */
    public switchValueType(event, i: number) {
        if (event.target.value === 'empty' || event.target.value === 'notempty') {
            this.struct[i].value = null;
        } else if (event.target.value === 'anyof' || event.target.value === 'allof') {
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
     * @param event
     * @param i Condition number
     * @param j Choice number
     */
    public selectedItems(event, i: number, j: number) {
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
    public ConditionAdd() {
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
    public ConditionDel() {
        // check if condition exists
        if (this.struct.length === 0) {
            return;
        }

        this.struct.splice(this.struct.length - 1, 1);
        this.modelChanged(null);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
