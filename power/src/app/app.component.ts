import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';

import { AuthService } from '@app/shared/auth/auth.service';
import { UpdateService } from './update.service';
import { SEOService } from './shared/seo/seo.service';
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
    public showIENotice = false;
    public config = environment.config;
    public appVersion = { version: 'dev', branch: 'local' };
    public hasInternet = navigator.onLine;
    public uri = location;
    public baseurl = location.pathname + location.search;

    private _subscription: Subscription;
    private unsubscribe$: Subject<void> = new Subject<void>();

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        public cdRef: ChangeDetectorRef,
        public httpClient: HttpClient,
        public auth: AuthService,
        public router: Router,
        public platform: Platform,
        public us: UpdateService,
        public seo: SEOService
    ) {
        this.seo.setTitle($localize`Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Das Immobilienmarkt Portal Niedersachsen stellt gebührenfrei die Bodenrichtwerte, Grundstücksmarktdaten und den Immobilienpreisindex für Niedersachsen bereit.` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwertinformationssystem, Bodenrichtwert, BORIS.NI, BORIS, Bauland, Landwirtschaft, Grundstücksmarktbericht, Landesgrundstücksmarktbericht, Landesgrundstücksmarktdaten, Immobilienpreisindex, NIPIX, Immobilien-Preis-Kalkulator, IPK, OGC, Geodienste, Geodatendienste` });

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
            } else if (event instanceof NavigationError) {
                // log navigation error if not in production
                if (!environment.production) {
                    console.error(event.error);
                }
            }
        });

        // set baseurl
        /* istanbul ignore next */
        if (location.origin.startsWith('https://demo-')) {
            environment.baseurl = 'https://dev.power.niedersachsen.dev';
            environment.borisOws = environment.baseurl + environment.borisOws;
            environment.alkisOws = environment.baseurl + environment.alkisOws;
            environment.formAPI = environment.baseurl + environment.formAPI;
        }
    }

    ngOnInit(): void {
        /* istanbul ignore else */
        if (isPlatformBrowser(this.platformId)) {
            // load version
            this.httpClient.get('/assets/version.json').subscribe(data => {
                if (data && data['version']) {
                    this.appVersion = data as { version: string, branch: string };
                    environment.config.version = this.appVersion;
                }
                this.showOfflineNotice = false;
            }, error => {
                // failed to load
                console.error(error);
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

            // IE+Edge deprecation notice
            /* eslint-disable-next-line */
            const isIE = /*@cc_on!@*/false || !!document['documentMode'];
            const isEdge = !isIE && !!window.StyleMedia;
            /* istanbul ignore next */
            if (isIE || isEdge) {
                this.showIENotice = true;
            }
        } else {
            // disable warnings
            this.showOfflineNotice = false;
            this.showBrowserNotice = false;
            this.showIENotice = false;
            this.hasInternet = true;
            this.appVersion = { version: 'cache', branch: 'rendered' };
            environment.config.version = this.appVersion;
        }
    }

    ngAfterViewChecked(): void {
        this.cdRef.detectChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this._subscription.unsubscribe();
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
