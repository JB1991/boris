import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '@app/shared/auth/auth.service';

@Component({
    selector: 'power-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
    public mail = 'incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com';
    public stateFilter = 'all';
    public search = '';
    public rss = [];

    constructor(public titleService: Title,
        private httpClient: HttpClient,
        public auth: AuthService) {
        this.titleService.setTitle($localize`Feedback - POWER.NI`);
    }

    public async ngOnInit() {
        await this.loadRSSFeed();
    }

    /**
     * Loads RSS feed XML from gitlab
     */
    public async loadRSSFeed() {
        // craft uri
        let uri = '/feedback-rss/?state=' + encodeURIComponent(this.stateFilter);
        if (this.search) {
            uri += '&search=' + encodeURIComponent(this.search);
        }

        const tmp = await this.httpClient.get(uri, this.auth.getHeaders('text', 'application/atom+xml', false)).toPromise();
        const parser = new DOMParser();
        this.rss = [].slice.call(parser.parseFromString(tmp.toString(), 'application/xml').documentElement.children);
    }

    /**
     * Searches for keywords in rss feed from github
     */
    public async doSearch() {
        await this.loadRSSFeed();
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
