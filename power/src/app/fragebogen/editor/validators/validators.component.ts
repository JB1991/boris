import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { StorageService } from '../storage.service';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css']
})
export class ValidatorsComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Output() dataChange = new EventEmitter<any>();

  public struct: any = [];
  public questions: any = [];

  constructor(public storage: StorageService) { }

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    // check if data exists
    if (!this.data || !this.data.validators) {
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
        case 'text':
          data = {
            type: validator.type,
            min: validator.minLength,
            max: validator.maxLength,
            allowDigits: validator.allowDigits
          };
          break;
        case 'regex':
          data = {
            type: validator.type,
            regex: validator.regex
          };
          break;
        case 'expression':
          data = {
            type: validator.type,
            expression: validator.expression,
            question: '',
            operator: '',
            value: '',
            choices: null
          };
          const split = validator.expression.split(' ');

          // get question
          if (split[0].startsWith('{')) {
            data.question = split[0].substring(1, split[0].length - 1);
          } else {
            throw new Error('Expected parameter to be variable');
          }

          // get operator
          data.operator = split[1];

          // check if has data
          if (split.length > 2) {
            // get data
            data.value = split[2].substring(1, split[2].length - 1);

            if (split[2].startsWith('[')) {
              // list
              const tmp2 = split[2].substring(1, split[2].length - 1);
              data.value = [];
              for (const item of tmp2.split(',')) {
                data.value.push(item.substring(1, item.length - 1));
              }
            } else if (split[2].startsWith('{')) {
              // variable
              data.value = split[2];
            }
          }
          break;
        default:
          throw new Error('Undown validator type');
      }
      this.struct.push(data);
    }
    this.loadChoices(null);
  }

  /**
   * Handles changes to forms
   * @param event Event
   */
  public modelChanged(event: Event) {
    this.data.validators = [];
    // convert form to validator object
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
        case 'text':
          data = {
            type: item.type,
            minLength: item.min,
            maxLength: item.max,
            allowDigits: item.allowDigits
          };
          break;
        case 'regex':
          data = {
            type: item.type,
            regex: item.regex,
            text: 'Ihre Eingabe entspricht dem gefordertem Format.'
          };
          break;
        case 'expression':
          data = {
            type: item.type,
            expression: ''
          };

          // add question and operator
          data.expression = '{' + item.question + '} ' + item.operator;

          // add values
          if (item.operator === 'empty' || item.operator === 'notempty') {
            // nothing
          } else if (item.operator === 'anyof' || item.operator === 'allof') {
            // array
            data.expression += ' [';
            for (let i = 0; i < item.value.length; i++) {
              if (!item.value[i]) { continue; }
              data.expression += '\'' + item.value[i] + '\'' + (i + 1 >= item.value.length ? '' : ',');
            }
            data.expression += ']';
          } else {
            // string
            if (!item.value) { item.value = ''; }
            if (!item.value.startsWith('{')) {
              // text
              data.expression += ' \'' + item.value + '\'';
            } else {
              // variable
              data.expression += ' ' + item.value;
            }
          }
          break;
        default:
          throw new Error('Undown validator type');
      }
      this.data.validators.push(data);
    }
    this.dataChange.emit(this.data);
    this.loadChoices(null);
  }

  /**
   * Switches type
   * @param event Event
   * @param i Number of validator
   */
  public switchType(event, i: number) {
    if (event.target.value === 'expression') {
      if (!this.struct[i].operator) {
        this.struct[i].question = '';
        this.struct[i].operator = 'equal';
        this.struct[i].value = '';
      }
    }
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
   * Adds entry to validators
   */
  public ValidatorAdd() {
    this.struct.splice(this.struct.length, 0, {
      type: 'numeric',
      min: null,
      max: null
    });
    this.modelChanged(null);
  }

  /**
   * Removes entry from validators
   */
  public ValidatorDel() {
    // check if condition exists
    if (this.struct.length === 0) {
      return;
    }

    this.struct.splice(this.struct.length - 1, 1);
    this.modelChanged(null);
  }

  /**
   * Adds predefined validator validator
   * @param event Event
   */
  public selectDefaultValidator(event: Event) {
    switch (event.target['value']) {
      case 'date1':
        this.struct.splice(this.struct.length, 0, {
          type: 'regex',
          data: '^(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)\\d{2})$'
        });
        break;
        case 'date2':
          this.struct.splice(this.struct.length, 0, {
            type: 'regex',
            data: '^((?:19|20)\\d{2})-(1[012]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])$'
          });
          break;
      default:
        return;
    }

    // reset select
    event.target['value'] = '';
    this.modelChanged(null);
  }
}
