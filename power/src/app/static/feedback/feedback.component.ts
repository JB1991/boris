import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConfigService } from '@app/config.service';

@Component({
    selector: 'power-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

    public appVersion: any;
    public mail: string = 'incoming+lgln-power-ni-power-frontend-17688796-issue-@incoming.gitlab.com';
    public subject: string;
    public body: string;


    constructor(public titleService: Title,
        public configService: ConfigService) {
        this.titleService.setTitle('Feedback geben - POWER.NI');
    }

    ngOnInit(): void {
        const branch = this.configService.appVersion.branch;
        const version = this.configService.appVersion.version;
        this.subject = encodeURIComponent('Version: ' + branch + '/' + version);
        const bodyTemp = 'Hallo,' + '<br>' + 'test';
        this.body = encodeURIComponent(bodyTemp);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
