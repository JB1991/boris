import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';

import { Config, ConfigService } from '@app/config.service';
import { AuthService } from '@app/shared/auth/auth.service';

@Component({
    selector: 'power-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
    public title = 'power';
    public isCollapsed = true;
    public isCollapsedAcc = true;
    public isCollapsedBRW = true;
    public isCollapsedImmo = true;
    public showPrintNotice = true;
    public show = false;
    public name: string;
    public config: Config;
    public appVersion: any = { version: 'local', branch: 'dev' };
    public uri = location;
    public baseurl = location.pathname + location.search;
    private _subscription: Subscription;

    private unsubscribe$: Subject<void> = new Subject<void>();

    constructor(@Inject(LOCALE_ID) public locale: string,
        public cdRef: ChangeDetectorRef,
        public configService: ConfigService,
        public httpClient: HttpClient,
        public auth: AuthService,
        public router: Router,
        public platform: Platform
    ) {
        /* istanbul ignore next */
        this._subscription = router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.isCollapsed = true;
                this.isCollapsedAcc = true;
                this.isCollapsedBRW = true;
                this.isCollapsedImmo = true;

                // update baseurl
                this.baseurl = location.pathname + location.search;
                if (this.baseurl.startsWith('/' + this.locale + '/')) {
                    this.baseurl = this.baseurl.substr(this.locale.length + 1);
                }
            }
        });
    }

    ngOnInit() {
        this.config = this.configService.config;

        // load version
        this.httpClient.get('/assets/version.json').subscribe(data => {
            if (data && data['version']) {
                this.appVersion = data;
                this.configService.appVersion = data;
            }
        });

        // disable warning for known browsers
        if (this.platform.SAFARI || this.platform.FIREFOX || this.platform.BLINK) {
            this.showPrintNotice = false;
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
