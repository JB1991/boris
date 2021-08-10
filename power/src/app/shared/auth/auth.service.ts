/* eslint-disable max-lines */
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

/**
 * AuthService handles authentication
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user: User;
    private timerHandle: NodeJS.Timeout;

    constructor(@Inject(LOCALE_ID) public locale: string,
        public router: Router,
        public httpClient: HttpClient) {
        /* istanbul ignore else */
        if (localStorage) {
            // load session
            this.loadSession(true);
        }
    }

    /* eslint-disable complexity */
    /**
     * Loads session from localStorage
     * @param refresh should refresh token if expired
     */
    public async loadSession(refresh = true): Promise<void> {
        // check if session is loaded and still valid
        if (this.IsAuthenticated()) {
            this.sessionCheck();
            return;
        }

        // load session from localstorage
        this.user = JSON.parse(localStorage.getItem('user'));
        // fix wrong timezone after parsing from json
        if (this.user && this.user.expires) {
            this.user.expires = new Date(this.user.expires);
        }

        // check if session is still valid
        if (this.IsAuthenticated()) {
            this.sessionCheck();
            return;
        }

        // session needs refresh
        if (refresh && this.user && this.user.token && this.user.token.refresh_token) {
            // craft post object
            let body = new HttpParams();
            body = body.set('grant_type', 'refresh_token');
            body = body.set('client_id', environment.auth.clientid);
            body = body.set('client_secret', environment.auth.clientsecret);
            body = body.set('refresh_token', this.user.token.refresh_token);

            try {
                // post login data
                const data = await this.httpClient.post(environment.auth.url + 'token', body,
                    this.getHeaders('json', 'application/x-www-form-urlencoded', false)).toPromise();
                // check for error
                if (!data || data['error']) {
                    console.error('Could not refresh: ' + data);

                    // delete localStorage
                    localStorage.removeItem('user');
                    this.user = null;
                    return;
                }
                // save data
                this.user.expires = new Date();
                this.user.expires.setSeconds(this.user.expires.getSeconds() + (data['expires_in'] / 2));
                this.user.token = data;
                this.user.data = this.parseUserinfo();
                localStorage.setItem('user', JSON.stringify(this.user));
                this.sessionCheck();
                return;
            } catch (error) {
                // failed to refresh
                console.error(error);

                // delete localStorage
                localStorage.removeItem('user');
                this.user = null;
                return;
            }
        }

        // delete localStorage
        localStorage.removeItem('user');
        this.user = null;
    }

    /**
     * Refreshes session after 5 minutes
     */
    private sessionCheck(): void {
        /* istanbul ignore next */
        if (environment.production) {
            // clear refresh timeout
            if (this.timerHandle) {
                clearTimeout(this.timerHandle);
                this.timerHandle = null;
            }

            // set refresh timeout
            /* eslint-disable-next-line scanjs-rules/call_setTimeout */
            this.timerHandle = setTimeout(async () => {
                await this.loadSession(true);
            }, 5 * 60000);
        }
    }

    /**
     * Returns user object
     * @returns User object
     */
    public getUser(): User {
        return this.user;
    }

    /**
     * Returns auth header
     * @returns Bearer token
     */
    public getBearer(): string {
        // check token
        if (!this.user || !this.user.token || !this.user.token.access_token) {
            return null;
        }
        return 'Bearer ' + this.user.token.access_token;
    }

    /**
     * Returns http options
     * @param responsetype How to parse file
     * @param contenttype Content-Type of file expected
     * @param auth True to send authoriziation
     * @returns Header
     */
    public getHeaders(responsetype = 'json', contenttype = 'application/json', auth = true): any {
        let header = new HttpHeaders().set('Content-Type', contenttype)
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache')
            .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
            .set('If-Modified-Since', '0');

        // check if user is authenticated
        if (auth && this.IsAuthenticated()) {
            header = header.set('Authorization', this.getBearer());
        }
        return { 'headers': header, 'responseType': responsetype };
    }

    /**
     * Requests auth token from keycloak
     * @param code Auth code
     * @returns Promise
     */
    public async KeycloakToken(code: string): Promise<void> {
        // check data
        if (!code) {
            throw new Error('code is required');
        }

        // craft post object
        let body = new HttpParams();
        body = body.set('grant_type', 'authorization_code');
        body = body.set('client_id', environment.auth.clientid);
        body = body.set('client_secret', environment.auth.clientsecret);
        body = body.set('code', code);
        body = body.set('redirect_uri', location.protocol + '//' + location.host +
            /* istanbul ignore next */
            (this.locale === 'de' ? '' : '/' + this.locale) + '/login');

        // post login data
        try {
            const data = await this.httpClient.post(environment.auth.url + 'token', body,
                this.getHeaders('json', 'application/x-www-form-urlencoded', false)).toPromise();
            // check for error
            if (!data || data['error']) {
                console.error('Could not get token: ' + data);
                return;
            }

            // save data
            const expire = new Date();
            expire.setSeconds(expire.getSeconds() + (data['expires_in'] / 2));
            this.user = { 'expires': expire, 'token': data, 'data': null };
            this.user.data = this.parseUserinfo();
            localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error) {
            // failed to login
            console.error(error);
            return;
        }
    }

    /**
     * Gets user info from keycloak
     * @returns User info
     */
    public parseUserinfo(): any {
        const b64 = this.user.token.access_token.split('.')[1];
        return JSON.parse(atob(b64));
    }

    /**
     * IsAuthEnabled returns true if auth module is enabled
     * @returns True if auth is enabled
     */
    public IsAuthEnabled(): boolean {
        if (!environment.production) {
            return false;
        }
        return true;
    }

    /**
     * IsAuthenticated returns true if user has valid session
     * @returns True if user is authenticated
     */
    public IsAuthenticated(): boolean {
        if (this.user && this.user.token && this.user.expires && new Date() < this.user.expires) {
            return true;
        }
        return false;
    }

    /**
     * Get role of user
     * @returns Role
     */
    private getRole(): Role {
        let role: Role = 'user';
        if (this.user.data && this.user.data.roles && Array.isArray(this.user.data.roles)) {
            for (const r of this.user.data.roles) {
                if (r === 'form_api_admin') {
                    return 'admin';
                }
                if (r === 'form_api_manager') {
                    role = 'manager';
                }
                if (r === 'form_api_editor') {
                    if (role !== 'manager') {
                        role = 'editor';
                    }
                }
            }
        }
        return role;
    }

    /**
     * Get groups of user
     * @returns Groups
     */
    private getGroups(): Array<string> {
        if (this.user.data && this.user.data.groups && Array.isArray(this.user.data.groups)) {
            return this.user.data.groups;
        }
        return [];
    }

    /**
     * Validates if user is authorized
     * @param roles Roles
     * @param owner Owner
     * @param groups Groups
     * @returns True if authorized
     */
    public IsAuthorized(roles: Array<Role>, owner: string, groups: Array<string>): boolean {
        if (!this.IsAuthEnabled()) {
            return true;
        }
        if (!this.IsAuthenticated()) {
            return false;
        }
        const userRole = this.getRole();
        const userGroups = this.getGroups();

        if (owner === this.user.data.sub || userRole === 'admin') {
            return true;
        }

        if (!hasRole(userRole, roles)) {
            return false;
        }

        for (const g of groups) {
            for (const ug of userGroups) {
                if (g === ug) {
                    return true;
                }
            }
        }
        return false;
    }
}

/**
 * Checks if role is allowed
 * @param role Role
 * @param allowed Allowed roles array
 * @returns True if allowed
 */
function hasRole(role: Role, allowed: Array<Role>): boolean {
    for (const r of allowed) {
        if (r === role) {
            return true;
        }
    }
    return false;
}

export type Role = 'user' | 'editor' | 'manager' | 'admin';

/**
 * Represents userdata
 */
export class User {
    expires: Date;
    token: any;
    data: any;
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
