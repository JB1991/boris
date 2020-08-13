import { Component, OnInit } from '@angular/core';
import { LoadingscreenService } from './loadingscreen.service';

@Component({
    selector: 'power-loadingscreen',
    templateUrl: './loadingscreen.component.html',
    styleUrls: ['./loadingscreen.component.css']
})
export class LoadingscreenComponent implements OnInit {

    constructor(public loadingscreen: LoadingscreenService) { }

    ngOnInit() {
    }

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
