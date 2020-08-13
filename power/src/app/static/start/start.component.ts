import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'power-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

    constructor(public title: Title) {
        this.title.setTitle($localize`Portal für Wertermittlung Niedersachsen`);
    }

    ngOnInit() {
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
