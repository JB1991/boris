import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

/**
 * SEOService handles search engine optimization
 */
@Injectable({
    providedIn: 'root'
})
export class SEOService {
    private BASE_URL = 'https://immobilienmarkt.niedersachsen.de';

    constructor(
        public titleService: Title,
        public meta: Meta,
        @Inject(DOCUMENT) private doc,
        @Inject(LOCALE_ID) public locale: string,
        public router: Router
    ) {
        /* istanbul ignore next */
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // update canonical url
                this.updateCanonicalURL(event.urlAfterRedirects);

                // update alternative languages if localization enabled
                if (environment.config.localized) {
                    this.updateAlternateLangs(event.urlAfterRedirects);
                }
            }
        });
    }

    /**
     * Updates canonical url in frontend
     * @param url URL
     */
    public updateCanonicalURL(url: string) {
        // update canonical url
        const links = this.doc.head.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (links[i].getAttribute('rel') === 'canonical') {
                links[i].setAttribute('href', this.BASE_URL
                    + (this.locale !== 'de' ? '/' + this.locale : '')
                    + (url.startsWith('/grundstuecksmarktberichte') ? url : url.split('?')[0]));
            }
        }
    }

    /**
     * Updates alternate languages in frontend
     * @param url URL
     */
    public updateAlternateLangs(url: string) {
        // check for every language
        skip: for (let i = 0; i < environment.config.languages.length; i++) {
            // skip de-simple
            if (environment.config.languages[i].short === 'de-simple') {
                continue skip;
            }

            // check if already exists
            const tmp = this.doc.head.getElementsByTagName('link');
            for (let j = 0; j < tmp.length; j++) {
                if (tmp[j].getAttribute('rel') === 'alternate' && tmp[j].getAttribute('hreflang') === environment.config.languages[i].short) {
                    tmp[j].setAttribute('href', this.BASE_URL + environment.config.languages[i].url + url);
                    continue skip;
                }
            }

            // skip current lang
            if (environment.config.languages[i].short === this.locale) {
                continue skip;
            }

            // create new
            const link = this.doc.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('hreflang', environment.config.languages[i].short);
            link.setAttribute('href', this.BASE_URL + environment.config.languages[i].url + url);
            this.doc.head.appendChild(link);
        }
    }
}
