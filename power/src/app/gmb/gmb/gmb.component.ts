import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import * as data from './gmb.json';

@Component({
    selector: 'power-gmb',
    templateUrl: './gmb.component.html',
    styleUrls: ['./gmb.component.scss']
})
export class GmbComponent implements OnInit {

    mapoptions = {};
    mapLoaded = false;

    downloadPath = 'http://localhost/';
    berichte = data['default'];


    constructor() {
    }

    ngOnInit(): void {
    }

    onChartInit($event): void {
    }


    onMapSelectChange($event): void {
    }

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
