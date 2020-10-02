import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'power-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

    public mail = 'incoming+lgln-power-ni-power-frontend-17688796-issue-@incoming.gitlab.com';


    constructor(public titleService: Title) {
        this.titleService.setTitle('Feedback geben - POWER.NI');
    }

    ngOnInit(): void {
    }

    /**
     * Copies the Email-Address to the clipboard
     */
    /* istanbul ignore next */
    public copyEmailToClipboard() {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.mail;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
