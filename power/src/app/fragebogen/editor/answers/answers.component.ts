import {
    Component, Input, Output, EventEmitter,
    InjectionToken, Inject, ChangeDetectionStrategy
} from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

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
    selector: 'power-forms-editor-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnswersComponent {
    @Input() public model: any;

    @Input() public hasImg = false;

    @Input() public data = new Array<any>();

    @Output() public dataChange = new EventEmitter<any>();

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) { }

    /**
     * Emit change if formular has changed
     */
    public changed(): void {
        this.dataChange.emit(this.data);
    }

    /**
     * Add new answer
     */
    public addAnswer(): void {
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
     * @param i Index
     */
    public delAnswer(i: number): void {
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
    public moveUp(i: number): void {
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
    public moveDown(i: number): void {
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

    /**
     * Delete image
     * @param i Index
     */
    public delImage(i: number): void {
        // check data
        if (i < 0 || i >= this.data.length) {
            throw new Error('i is invalid');
        }
        this.data[i].imageLink = '';
        this.dataChange.emit(this.data);
    }

    /* istanbul ignore next */
    /**
     * Uploads foto to formular
     * @param i Answer number
     */
    public uploadImage(i: number): void {
        // check data
        if (i < 0 || i >= this.data.length) {
            throw new Error('i is invalid');
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        // image selected
        input.onchange = (e: Event) => {
            if (e?.target) {
                return;
            }
            const file = (e.target as HTMLInputElement).files?.[0];
            const reader = new FileReader();
            reader.readAsDataURL(file as File);

            // upload success
            reader.onload = () => {
                // downscale image
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const oc = document.createElement('canvas');
                    const octx = oc.getContext('2d');
                    if (!(ctx && octx)) {
                        return;
                    }

                    canvas.width = 300; // destination canvas size
                    canvas.height = canvas.width * img.height / img.width;
                    let cur = {
                        width: Math.floor(img.width * 0.5),
                        height: Math.floor(img.height * 0.5)
                    };
                    oc.width = cur.width;
                    oc.height = cur.height;

                    octx.drawImage(img, 0, 0, cur.width, cur.height);

                    while (cur.width * 0.5 > 300) {
                        cur = {
                            width: Math.floor(cur.width * 0.5),
                            height: Math.floor(cur.height * 0.5)
                        };
                        octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
                    }
                    ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

                    // save image
                    this.data[i].imageLink = canvas.toDataURL('image/jpeg');
                    this.dataChange.emit(this.data);
                    input.remove();
                };

                /* eslint-disable-next-line scanjs-rules/assign_to_src */
                img.src = String(reader.result);
            };
        };
        input.click();
    }
}
