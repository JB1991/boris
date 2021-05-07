import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

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
                this.updateCanonicalURL(event.urlAfterRedirects);
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
}
