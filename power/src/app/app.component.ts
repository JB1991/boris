import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';

import { AuthService } from '@app/shared/auth/auth.service';
import { UpdateService } from './update.service';
import { environment } from '@env/environment';

@Component({
    selector: 'power-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
    public isCollapsed = true;
    public isCollapsedAcc = true;
    public isCollapsedBRW = true;
    public isCollapsedImmo = true;
    public showBrowserNotice = true;
    public showOfflineNotice = true;
    public config = environment.config;
    public appVersion: any = { version: 'dev', branch: 'local' };
    public hasInternet = navigator.onLine;
    public uri = location;
    public baseurl = location.pathname + location.search;

    private _subscription: Subscription;
    private unsubscribe$: Subject<void> = new Subject<void>();

    constructor(
        public titleService: Title,
        public meta: Meta,
        @Inject(DOCUMENT) private doc,
        @Inject(LOCALE_ID) public locale: string,
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        public cdRef: ChangeDetectorRef,
        public httpClient: HttpClient,
        public auth: AuthService,
        public router: Router,
        public platform: Platform,
        public us: UpdateService
    ) {
        this.titleService.setTitle($localize`Immobilienmarkt.NI`);
        this.meta.updateTag({ name: 'description', content: $localize`Gebührenfreier Zugriff auf Bodenrichtwerte und Grundstücksmarktdaten von Niedersachsen` });
        this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwerte, BORIS, Grundstücksmarktberichte, Landesgrundstücksmarktberichte, Landesgrund­stücks­markt­daten, Immobilienpreisindex, NIPIX, Immobilien-Preis-Kalkulator, IPK` });

        // check for updates
        this.us.checkForUpdates();

        /* istanbul ignore next */
        this._subscription = router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.isCollapsed = true;
                this.isCollapsedAcc = true;
                this.isCollapsedBRW = true;
                this.isCollapsedImmo = true;

                // update baseurl
                this.baseurl = event.urlAfterRedirects;
                if (this.baseurl.startsWith('/' + this.locale + '/')) {
                    this.baseurl = this.baseurl.substr(this.locale.length + 1);
                }

                // update canonical url
                const links = this.doc.head.getElementsByTagName('link');
                for (let i = 0; i < links.length; i++) {
                    if (links[i].getAttribute('rel') === 'canonical') {
                        links[i].setAttribute('href', 'https://immobilienmarkt.niedersachsen.de'
                            + (this.locale !== 'de' ? '/' + this.locale : '')
                            + (event.urlAfterRedirects.startsWith('/grundstuecksmarktberichte') ? event.urlAfterRedirects : event.urlAfterRedirects.split('?')[0]));
                    }
                }
            } else if (event instanceof NavigationError) {
                // log navigation error if not in production
                if (!environment.production) {
                    console.error(event.error);
                }
            }
        });
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            // load version
            this.httpClient.get('/assets/version.json').subscribe(data => {
                if (data && data['version']) {
                    this.appVersion = data;
                    environment.config.version = this.appVersion;
                }
                this.showOfflineNotice = false;
            }, error => {
                // failed to load
                console.error('could not load version.json');
                this.appVersion = { version: 'cache', branch: 'offline' };
                environment.config.version = this.appVersion;
                this.hasInternet = false;
            });

            // disable warning for known browsers
            /* istanbul ignore else */
            if (this.platform.SAFARI || this.platform.FIREFOX || this.platform.BLINK) {
                this.showBrowserNotice = false;
            }
        } else {
            // disable warnings
            this.showOfflineNotice = false;
            this.showBrowserNotice = false;
            this.hasInternet = true;
            this.appVersion = { version: 'cache', branch: 'rendered' };
            environment.config.version = this.appVersion;
        }
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this._subscription.unsubscribe();
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
