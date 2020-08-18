import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'power-tagbox',
    templateUrl: './tagbox.component.html',
    styleUrls: ['./tagbox.component.scss']
})
export class TagboxComponent implements OnInit {
    @Input() public dataList: string[] = [];
    @Input() public tagList: string[] = [];
    @Output() public tagListChange = new EventEmitter<string[]>();
    public tagInput: string;

    constructor() { }

    ngOnInit(): void {
    }

    /**
     * Adds tag to list
     */
    public addTag() {
        if (!this.tagInput || !this.tagInput.trim()) {
            return;
        }
        this.tagList.push(this.tagInput);
        this.tagListChange.emit(this.tagList);
        this.tagInput = '';
    }

    /**
     * Removes tag from list
     * @param i Tag number
     */
    public removeTag(i: number) {
        if (i < 0 || i >= this.tagList.length) {
            throw new Error('Invalid i');
        }
        this.tagList.splice(i, 1);
        this.tagListChange.emit(this.tagList);
    }
}
