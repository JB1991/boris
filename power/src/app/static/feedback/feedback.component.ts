import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '@app/shared/auth/auth.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

@Component({
    selector: 'power-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
    public mail = 'incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com';
    public stateFilter = 'opened';
    public search = '';
    public rss = [];
    /* eslint-disable-next-line max-len */
    private reg_email = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm;
    private reg_servicedesk = /Service Desk (.*?): /gm;
    private reg_tel = /(\+[0-9 -]*)/gm;

    constructor(
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        public titleService: Title,
        public meta: Meta,
        private httpClient: HttpClient,
        public auth: AuthService,
        public alerts: AlertsService
    ) {
        this.titleService.setTitle($localize`Feedback - Immobilienmarkt.NI`);
        this.meta.updateTag({ name: 'description', content: $localize`Helfen Sie uns unseren Service zu verbessern, indem Sie uns wertvolles Feedback senden` });
        this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Feedback` });
    }

    async ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            await this.loadRSSFeed();
        }
    }

    /**
     * Loads RSS feed XML from gitlab
     */
    /* istanbul ignore next */
    public async loadRSSFeed() {
        // craft uri
        let uri = '/feedback-rss/?state=' + encodeURIComponent(this.stateFilter);
        if (this.search) {
            uri += '&search=' + encodeURIComponent(this.search);
        }

        try {
            // get rss feed
            const tmp = await this.httpClient.get(uri, this.auth.getHeaders('text', 'application/atom+xml', false)).toPromise();

            // parse rss feed
            const parser = new DOMParser();
            const di = parser.parseFromString(tmp.toString(), 'application/xml');
            const childs = di.getElementsByTagName('entry');

            this.rss = [];
            for (let i = 0; i < childs.length; i++) {
                this.rss.push(childs[i]);
            }
        } catch (error) {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, $localize`Es konnte kein Feedback geladen werden.`);
        }
    }

    /**
     * Searches for keywords in rss feed from github
     */
    public async doSearch() {
        this.search = this.search.replace(this.reg_email, '');
        await this.loadRSSFeed();
    }

    /**
     * Filters title
     * @param param Title
     */
    public filterTitle(param: string): string {
        return param.replace(this.reg_servicedesk, '').replace(this.reg_email, '***@email');
    }

    /**
     * Filters body
     * @param param Title
     */
    public filterBody(param: string): string {
        return param.replace(this.reg_email, '***@email').replace(this.reg_tel, '***');
    }

    /**
     * Copies the Email-Address to the clipboard
     */
    /* istanbul ignore next */
    public copyEmailToClipboard() {
        throw Error('I SUCK');
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
