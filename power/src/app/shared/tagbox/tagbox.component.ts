import {
    Component, Input, Output, EventEmitter,
    InjectionToken, Inject, ChangeDetectionStrategy
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
    selector: 'power-tagbox',
    templateUrl: './tagbox.component.html',
    styleUrls: ['./tagbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagboxComponent {
    @Input() public tagboxLabel: string;
    @Input() public displayBlock = false;
    @Input() public dataList: string[];
    @Input() public tagList: string[];
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
            this.tagInput = '';
        } else {
            this.tagInput = '';
        }
    }

    /**
     * Removes tag from list
     * @param i Tag number
     */
    public removeTag(i: number) {
        if (this.tagList) {
            if (i < 0 || i >= this.tagList.length) {
                throw new Error('Invalid i');
            }
            this.tagList.splice(i, 1);
        }
    }
}
