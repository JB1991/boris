import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

import { AuthService } from '@app/shared/auth/auth.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

@Component({
    selector: 'power-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(@Inject(LOCALE_ID) public locale: string,
        public titleService: Title,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public auth: AuthService,
        public loadingscreen: LoadingscreenService,
        public alerts: AlertsService) {
        this.titleService.setTitle($localize`Login - Immobilienmarkt.NI`);
    }

    async ngOnInit() {
        this.loadingscreen.setVisible(true);
        await this.authenticate();
    }

    /**
     * Handles user authentication
     */
    public async authenticate() {
        // get redirect uri
        let redirect = this.activatedRoute.snapshot.queryParamMap.get('redirect');
        if (redirect) {
            // save uri
            if (redirect.startsWith('/' + this.locale + '/')) {
                redirect = redirect.substr(this.locale.length + 1);
            }
            localStorage.setItem('redirect', redirect);
        } else {
            // try load redirect uri
            redirect = localStorage.getItem('redirect');
            localStorage.removeItem('redirect');
            if (!redirect) {
                redirect = '/';
            }
        }

        // check if user is authenticated
        if (this.auth.IsAuthenticated()) {
            console.log('User is authenticated');
            this.router.navigate([redirect], { replaceUrl: true });
            return;
        }

        // check if keycloak params are set
        const session = this.activatedRoute.snapshot.queryParamMap.get('code');
        if (session) {
            // get access token
            await this.auth.KeycloakToken(session);

            // check if user is authenticated
            if (this.auth.IsAuthenticated()) {
                console.log('User has authenticated');
                this.router.navigate([redirect], { replaceUrl: true });
                return;
            }

            // failed to authenticate
            localStorage.removeItem('user');
            this.auth.user = null;
            console.error('Authentication failed');
            this.alerts.NewAlert('danger', $localize`Login fehlgeschlagen`,
                $localize`Es konnte kein Token vom Endpunkt bezogen werden.`);
            this.router.navigate(['/'], { replaceUrl: true });
            return;
        }

        // redirect to auth page
        this.redirect(environment.auth.url + 'auth' +
            '?response_type=code' +
            '&client_id=' + encodeURIComponent(environment.auth.clientid) +
            '&redirect_uri=' + encodeURIComponent(location.protocol + '//' + location.host +
                /* istanbul ignore next */
                (this.locale === 'de' ? '' : '/' + this.locale) +
                '/login'));
    }

    /**
     * Redirects to external page. This exists to prevent redirect on karma tests
     * @param url redirect url
     */
    public redirect(url) {
        document.location.href = url;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
