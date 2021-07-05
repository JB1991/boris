import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AuthService } from '@app/shared/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        public router: Router,
        public auth: AuthService,
        public loadingscreen: LoadingscreenService,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Logout - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Ausloggen vom Immobilienmarkt.NI Portal` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Logout` });
    }

    ngOnInit(): void {
        /* istanbul ignore else */
        if (localStorage) {
            this.loadingscreen.setVisible(true);

            // delete localStorage
            localStorage.removeItem('user');
            this.auth.user = null;

            // redirect to logout page
            this.redirect(environment.auth.url + 'logout' +
                '?client_id=' + encodeURIComponent(environment.auth.clientid) +
                '&redirect_uri=' + encodeURIComponent(location.protocol + '//' + location.host +
                    /* istanbul ignore next */
                    (this.locale === 'de' ? '' : '/' + this.locale + '/')
                    + '?logout=true'));
        }
    }

    /**
     * Redirects to external page. This exists to prevent redirect on karma tests
     * @param url redirect url
     */
    public redirect(url: string): void {
        /* eslint-disable-next-line scanjs-rules/assign_to_href */
        document.location.href = url;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
