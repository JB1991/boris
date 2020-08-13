import { Component, Input } from '@angular/core';

@Component({
    selector: 'power-bodenrichtwert-detail',
    templateUrl: './bodenrichtwert-detail.component.html',
    styleUrls: ['./bodenrichtwert-detail.component.css'],
})
export class BodenrichtwertDetailComponent {

    @Input() feature: any;

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
