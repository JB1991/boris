import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { environment } from '@env/environment';

/**
 * SEOService handles search engine optimization
 */
@Injectable({
    providedIn: 'root'
})
export class SEOService {
    public readonly BASE_URL = 'https://immobilienmarkt.niedersachsen.de';

    public URL_PARAMETER: string[] = [];

    constructor(
        public title: Title,
        public meta: Meta,
        @Inject(DOCUMENT) public doc: Document,
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
    public updateCanonicalURL(url: string): void {
        // update canonical url
        const links = this.doc.head.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (links[i].getAttribute('rel') === 'canonical') {
                links[i].setAttribute('href', this.BASE_URL
                    + (this.locale !== 'de' ? '/' + this.locale : '')
                    + this.stripURL(url));
            }
        }
    }

    /**
     * Updates alternate languages in frontend
     * @param url URL
     */
    public updateAlternateLangs(url: string): void {
        // check for every language
        skip: for (let i = 0; i < environment.config.languages.length; i++) {
            // skip de-simple
            if (environment.config.languages[i].short === 'de-simple') {
                continue;
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
                continue;
            }

            // create new
            const link = this.doc.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('hreflang', environment.config.languages[i].short);
            link.setAttribute('href', this.BASE_URL + environment.config.languages[i].url + url);
            this.doc.head.appendChild(link);
        }
    }

    /**
     * Get the title of the current HTML document.
     * @returns Title
     */
    public readonly getTitle = (): string => this.title.getTitle();

    /* eslint-disable-next-line jsdoc/require-returns */
    /**
     * Set the title of the current HTML document.
     * @param newTitle New title
     */
    public readonly setTitle = (newTitle: string): void => this.title.setTitle(newTitle);

    /**
     * Modifies an existing `<meta>` tag element in the current HTML document.
     * @param tag The tag description with which to replace the existing tag content.
     * @param selector A tag attribute and value to match against, to identify
     * an existing tag. A string in the format `"tag_attribute=`value string`"`.
     * If not supplied, matches a tag with the same `name` or `property` attribute value as the
     * replacement tag.
     * @returns The modified element.
     */
    public readonly updateTag = (tag: MetaDefinition, selector?: string): HTMLMetaElement | null =>
        this.meta.updateTag(tag, selector);

    /**
     * This method sets the robots meta tag, to allow searchengines index current page
     * @param allow True to allow
     */
    public setAllowRobots(allow: boolean): void {
        if (allow) {
            this.meta.updateTag({ name: 'robots', content: 'index,follow' });
        } else {
            this.meta.updateTag({ name: 'robots', content: 'noindex,follow' });
        }
    }

    /**
     * Returns state of robots meta tag
     * @returns True of robots are allowed to index current page
     */
    public getAllowRobots(): boolean {
        /* istanbul ignore next */
        return this.meta.getTag('name="robots"')?.content === 'index,follow';
    }

    /**
     * Whitelist URL parameter for canonical url
     * @param param Name
     */
    public addURLParameter(param: string): void {
        if (!this.URL_PARAMETER.includes(param)) {
            this.URL_PARAMETER.splice(0, 0, param);
        }
    }

    /**
     * Removes URL parameter from whitelist
     * @param param Name
     * @returns True if param was in list
     */
    public delURLParameter(param: string): boolean {
        const index = this.URL_PARAMETER.indexOf(param);
        if (index !== -1) {
            this.URL_PARAMETER.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Removes not whitelisted url params
     * @param url URL
     * @returns Modified URL
     */
    public stripURL(url: string): string {
        const tmpsplit = url.split('?');
        // check if params exists
        if (tmpsplit.length === 2) {
            const params = new URLSearchParams(tmpsplit[1]);

            // check if whitelisted
            (new URLSearchParams(tmpsplit[1])).forEach((_, key) => {
                if (!this.URL_PARAMETER.includes(key)) {
                    params.delete(key);
                }
            });

            return tmpsplit[0] + (!params.toString() ? '' : '?' + params.toString());
        }
        return url;
    }
}
