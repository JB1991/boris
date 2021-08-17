import {
    Component, Input, Output, EventEmitter,
    InjectionToken, Inject, ChangeDetectionStrategy
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
    selector: 'power-tagbox',
    templateUrl: './tagbox.component.html',
    styleUrls: ['./tagbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagboxComponent {
    @Input() public placeholder = '';
    @Input() public eid = '';
    @Input() public dataList = new Array<string>();
    @Input() public tagList = new Array<string>();
    @Output() public tagListChange = new EventEmitter<string[]>();
    @Input() public editable = true;
    @Input() public max = 200;
    public tagInput = '';

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) { }

    /**
     * Adds tag to list
     */
    public addTag(): void {
        if (!this.tagList) {
            this.tagList = [];
        }
        if (!this.tagInput || !this.tagInput.trim()) {
            return;
        }
        this.tagInput = this.tagInput.toLowerCase();
        if (!this.tagList.includes(this.tagInput)) {
            if (typeof this.max === 'number' && this.tagList.length >= this.max) {
                throw new Error('Reached tagbox limit');
            }
            this.tagList.push(this.tagInput);
            this.tagListChange.emit(this.tagList);
        }
        this.tagInput = '';
    }

    /**
     * Removes tag from list
     * @param i Tag number
     */
    public removeTag(i: number): void {
        /* istanbul ignore else */
        if (this.tagList) {
            if (i < 0 || i >= this.tagList.length) {
                throw new Error('Invalid i');
            }
            this.tagList.splice(i, 1);
            this.tagListChange.emit(this.tagList);
        }
    }

    /**
     * Deletes all tags from list
     */
    public removeAll(): void {
        this.tagList = [];
        this.tagListChange.emit(this.tagList);
    }
}
