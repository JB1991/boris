import { Component, Input, Output, EventEmitter, InjectionToken, Inject } from '@angular/core';
import { identifierModuleUrl } from '@angular/compiler';


const UNIQ_ID_TOKEN = new InjectionToken('ID');
let id = 0;

@Component({
    selector: 'power-tagbox',
    templateUrl: './tagbox.component.html',
    styleUrls: ['./tagbox.component.scss'],
    providers: [
        {
            provide: UNIQ_ID_TOKEN,
            useFactory: () => id++
        }
    ]
})
export class TagboxComponent {
    @Input() public tagboxLabel: string;
    @Input() public dataList: string[] = [];
    @Input() public tagList: string[] = [];
    @Output() public tagListChange = new EventEmitter<string[]>();
    public tagInput: string;

    constructor(
        @Inject(UNIQ_ID_TOKEN)
        public uniqId: number
    ) { }

    /**
     * Adds tag to list
     */
    public addTag() {
        if (!this.tagInput || !this.tagInput.trim()) {
            return;
        }
        if (!this.tagList) {
            this.tagList = [];
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
