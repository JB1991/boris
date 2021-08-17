import { Component } from '@angular/core';

@Component({
    selector: 'power-markdown-instructions',
    templateUrl: './markdown-instructions.component.html',
    styleUrls: ['./markdown-instructions.component.scss']
})
export class MarkdownInstructionsComponent {
    public title = $localize`Hilfe zur Formatierung`;

    constructor() {
        // This is intentional
    }
}
