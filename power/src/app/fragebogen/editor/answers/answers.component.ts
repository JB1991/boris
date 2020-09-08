import { Component, Input, Output, EventEmitter, ViewChild, InjectionToken, Inject } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

const UNIQ_ID_TOKEN = new InjectionToken('ID');
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
    styleUrls: ['./answers.component.scss']
})
export class AnswersComponent {
    @ViewChild('answersForm') public myForm;
    @Input() public hasImg = false;
    @Input() public data: any = [];
    @Output() public dataChange = new EventEmitter<any>();

    constructor(@Inject(UNIQ_ID_TOKEN) public uniqId: number) { }

    /**
     * Emit change if formular has changed
     */
    public changed() {
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

    /**
     * Delete image
     * @param i Index
     */
    public delImage(i: number) {
        // check data
        if (i < 0 || i >= this.data.length) {
            throw new Error('i is invalid');
        }
        this.data[i].imageLink = '';
    }

    /**
     * Uploads foto to formular
     * @param i Answer number
     */
    /* istanbul ignore next */
    public uploadImage(i: number) {
        // check data
        if (i < 0 || i >= this.data.length) {
            throw new Error('i is invalid');
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        // image selected
        input.onchange = (e: Event) => {
            const file = e.target['files'][0];
            const reader = new FileReader();
            reader.readAsDataURL(file);

            // upload success
            reader.onload = () => {
                // downscale image
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        oc = document.createElement('canvas'),
                        octx = oc.getContext('2d');

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
                    input.remove();
                };
                img.src = String(reader.result);
            };
        };
        input.click();
    }
}
