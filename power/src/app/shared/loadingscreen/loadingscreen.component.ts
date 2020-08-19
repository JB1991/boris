import { Component } from '@angular/core';
import { LoadingscreenService } from './loadingscreen.service';

@Component({
    selector: 'power-loadingscreen',
    templateUrl: './loadingscreen.component.html',
    styleUrls: ['./loadingscreen.component.css']
})
export class LoadingscreenComponent {

    constructor(public loadingscreen: LoadingscreenService) { }
}
