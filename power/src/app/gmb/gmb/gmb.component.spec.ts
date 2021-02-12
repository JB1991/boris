import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GmbComponent } from './gmb.component';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import {
    download,
    plusCircle,
    dashCircle,
    infoCircle
} from 'ngx-bootstrap-icons';

// Select some icons (use an object, not an array)
/* eslint-disable object-shorthand */
const icons = {
    download,
    plusCircle,
    dashCircle,
    infoCircle
};
/* eslint-enable object-shorthand */


describe('GmbComponent', () => {
    let component: GmbComponent;
    let fixture: ComponentFixture<GmbComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxBootstrapIconsModule.forRoot(icons),
                NgxEchartsModule.forRoot({ echarts }) // eslint-disable-line object-shorthand
            ],
            declarations: [ GmbComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GmbComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
