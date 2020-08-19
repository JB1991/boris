import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'power-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss']
})
export class StartComponent {

    constructor(public title: Title) {
        this.title.setTitle($localize`Portal für Wertermittlung Niedersachsen`);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
