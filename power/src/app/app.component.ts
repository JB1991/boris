import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Config, ConfigService } from '@app/config.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@app/shared/auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'power-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
    title = 'power';
    isCollapsed = true;
    isCollapsedAcc = true;
    show = false;
    name: string;
    public config: Config;
    public appVersion: any = { version: 'local', branch: 'dev' };
    public uri = location;
    public baseurl = location.pathname;
    private _subscription: Subscription;

    private unsubscribe$: Subject<void> = new Subject<void>();

    constructor(@Inject(LOCALE_ID) public locale: string,
        public cdRef: ChangeDetectorRef,
        public configService: ConfigService,
        public httpClient: HttpClient,
        public auth: AuthService,
        public router: Router
    ) {
        /* istanbul ignore next */
        this._subscription = router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // update baseurl
                this.baseurl = location.pathname;
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
            }
        });
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
