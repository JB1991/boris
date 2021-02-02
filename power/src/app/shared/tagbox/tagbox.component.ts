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
    @Input() public eid: string;
    @Input() public dataList: string[];
    @Input() public tagList: string[];
    @Input() public editable = true;
    public tagInput = '';

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) { }

    /**
     * Adds tag to list
     */
    public addTag() {
        if (!this.tagList) {
            this.tagList = [];
        }
        if (!this.tagInput || !this.tagInput.trim()) {
            return;
        }
        if (!this.tagList.includes(this.tagInput)) {
            this.tagList.push(this.tagInput);
        }
        this.tagInput = '';
    }

    /**
     * Removes tag from list
     * @param i Tag number
     */
    public removeTag(i: number) {
        /* istanbul ignore else */
        if (this.tagList) {
            if (i < 0 || i >= this.tagList.length) {
                throw new Error('Invalid i');
            }
            this.tagList.splice(i, 1);
        }
    }
}
