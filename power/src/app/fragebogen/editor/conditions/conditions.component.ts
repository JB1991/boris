import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { StorageService } from '../storage.service';

@Component({
    selector: 'power-formulars-editor-conditions',
    templateUrl: './conditions.component.html',
    styleUrls: ['./conditions.component.css']
})
export class ConditionsComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() dataChange = new EventEmitter<any>();

    public struct: any = [];
    public questions: any = [];

    constructor(public storage: StorageService) { }

    ngOnInit() {
        // make question list
        this.questions = [];
        for (let i = 0; i < this.storage.model.pages.length; i++) {
            for (const element of this.storage.model.pages[i].elements) {
                // add to list
                if (element.type !== 'matrix') {
                    this.questions.push({
                        name: element.name,
                        title: element.name + ': ' + element.title,
                        type: element.type,
                        choices: (element.choices ? element.choices : null)
                    });
                } else {
                    for (const q of element.rows) {
                        this.questions.push({
                            name: element.name + '.' + q.value,
                            title: element.name + ': ' + (q.text ? q.text : q.value),
                            type: element.type,
                            choices: element.columns
                        });
                    }
                }
            }
        }
        this.loadChoices(null);
    }

    ngOnChanges(changes: SimpleChanges) {
        // check if data exists
        if (!this.data) {
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
                tmp.question = split[i].substring(1, split[i].length - 1);
                i++;
            } else {
                throw new Error('Expected parameter to be variable');
            }

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
            if (!item.question) { continue; }
            if (this.data) { this.data += ' '; }

            // add condition
            if (item.condition) {
                this.data += item.condition + ' ';
            }
            // add question and operator
            this.data += '{' + item.question + '} ' + item.operator;

            // add values
            if (item.operator === 'empty' || item.operator === 'notempty') {
                // nothing
            } else if (item.operator === 'anyof' || item.operator === 'allof') {
                // array
                this.data += ' [';
                for (let i = 0; i < item.value.length; i++) {
                    if (!item.value[i]) { continue; }
                    this.data += '\'' + item.value[i] + '\'' + (i + 1 >= item.value.length ? '' : ',');
                }
                this.data += ']';
            } else {
                // string
                if (!item.value) { item.value = ''; }
                if (!item.value.startsWith('{')) {
                    // text
                    this.data += ' \'' + item.value + '\'';
                } else {
                    // variable
                    this.data += ' ' + item.value;
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
                if (item.question === question.name) {
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
