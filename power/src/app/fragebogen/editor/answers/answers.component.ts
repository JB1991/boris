import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'power-forms-editor-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnDestroy {
    @Input() public hasImg = false;
    @Input() public data: any = [];
    @Output() public dataChange = new EventEmitter<any>();

    constructor() { }

    ngOnDestroy() {
        this.dataChange.emit(this.data);
    }

    /**
     * Add new answer
     */
    public addAnswer() {
        if (!this.hasImg) {
            this.data.push({
                value: '',
                text: {
                    default: ''
                }
            });
        } else {
            this.data.push({
                value: '',
                text: {
                    default: ''
                },
                imageLink: '/assets/logos/logo.png'
            });
        }
        this.dataChange.emit(this.data);
    }

    /**
     * Delete answer
     */
    public delAnswer(i: number) {
        // check data
        if (i < 0 || i >= this.data.length) {
            throw new Error('i is invalid');
        }
        this.data.splice(i, 1);
        this.dataChange.emit(this.data);
    }

    /**
     * Moves item up
     * @param i Index
     */
    public moveUp(i: number) {
        // check data
        if (i < 0 || i >= this.data.length) {
            throw new Error('i is invalid');
        }
        // check if element can move up
        if (i === 0) {
            return;
        }
        moveItemInArray(this.data, i, i - 1);
        this.dataChange.emit(this.data);
    }

    /**
     * Moves item down
     * @param i Index
     */
    public moveDown(i: number) {
        // check data
        if (i < 0 || i >= this.data.length) {
            throw new Error('i is invalid');
        }
        // check if element can move down
        if (i === this.data.length - 1) {
            return;
        }
        moveItemInArray(this.data, i, i + 1);
        this.dataChange.emit(this.data);
    }
}
