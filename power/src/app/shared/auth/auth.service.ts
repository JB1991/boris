/* eslint-disable @typescript-eslint/array-type */
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
    public user?: User = undefined;
    private timerHandle?: NodeJS.Timeout;

    constructor(@Inject(LOCALE_ID) public locale: string,
        public router: Router,
        public httpClient: HttpClient) {
        /* istanbul ignore else */
        if (localStorage) {
            // load session
            void this.loadSession(true);
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
        const tmp = localStorage.getItem('user');
        if (!tmp) {
            return;
        }
        this.user = JSON.parse(tmp);
        // fix wrong timezone after parsing from json
        if (this.user?.expires) {
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
                const data = await this.httpClient.post<JWTToken | JWTError>(environment.auth.url + 'token', body,
                    this.getHeaders('json', 'application/x-www-form-urlencoded', false)).toPromise();
                // check for error
                if (!data || (data as JWTError).error) {
                    console.error('Could not refresh: ' + data);

                    // delete localStorage
                    localStorage.removeItem('user');
                    this.user = undefined;
                    return;
                }
                // save data
                this.user.expires = new Date();
                this.user.expires.setSeconds(this.user.expires.getSeconds() + ((data as JWTToken).expires_in / 2));
                this.user.token = data as JWTToken;
                this.user.data = this.parseUserinfo();
                localStorage.setItem('user', JSON.stringify(this.user));
                this.sessionCheck();
                return;
            } catch (error) {
                // failed to refresh
                console.error(error);

                // delete localStorage
                localStorage.removeItem('user');
                this.user = undefined;
                return;
            }
        }

        // delete localStorage
        localStorage.removeItem('user');
        this.user = undefined;
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
                this.timerHandle = undefined;
            }

            // set refresh timeout
            /* eslint-disable-next-line scanjs-rules/call_setTimeout */
            this.timerHandle = setTimeout(() => {
                void this.loadSession(true);
            }, 5 * 60000);
        }
    }

    /**
     * Returns user object
     * @returns User object
     */
    public getUser(): User | undefined {
        return this.user;
    }

    /**
     * Returns auth header
     * @returns Bearer token
     */
    public getBearer(): string | undefined {
        // check token
        if (!this.user || !this.user.token || !this.user.token.access_token) {
            return undefined;
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
    public getHeaders(responsetype = 'json', contenttype = 'application/json', auth = true): { headers: HttpHeaders, responseType: any } {
        let header = new HttpHeaders().set('Content-Type', contenttype)
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache')
            .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
            .set('If-Modified-Since', '0');

        // check if user is authenticated
        const bearer = this.getBearer();
        if (auth && this.IsAuthenticated() && bearer) {
            header = header.set('Authorization', bearer);
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
            const data = await this.httpClient.post<JWTToken | JWTError>(environment.auth.url + 'token', body,
                this.getHeaders('json', 'application/x-www-form-urlencoded', false)).toPromise();
            // check for error
            if (!data || (data as JWTError).error) {
                console.error('Could not get token: ' + data);
                return;
            }

            // save data
            const expire = new Date();
            expire.setSeconds(expire.getSeconds() + ((data as JWTToken).expires_in / 2));
            this.user = { 'expires': expire, 'token': data as JWTToken, 'data': undefined };
            if (this.user) {
                this.user.data = this.parseUserinfo();
            }
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
    public parseUserinfo(): UserDetails | undefined {
        if (this.user?.token) {
            const b64 = this.user.token.access_token.split('.')[1];
            return JSON.parse(atob(b64));
        }
        return undefined;
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
        if (this.user?.token && this.user?.expires && new Date() < this.user.expires) {
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
        if (this.user?.data && this.user?.data.roles && Array.isArray(this.user.data.roles)) {
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
    private getGroups(): string[] {
        if (this.user?.data && this.user?.data.groups && Array.isArray(this.user.data.groups)) {
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
    public IsAuthorized(roles: Role[], owner: string, groups: string[]): boolean {
        if (!this.IsAuthEnabled()) {
            return true;
        }
        if (!this.IsAuthenticated()) {
            return false;
        }
        const userRole = this.getRole();
        const userGroups = this.getGroups();

        if (owner === this.user?.data?.sub || userRole === 'admin') {
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

/**
 * User role
 */
export type Role = 'user' | 'editor' | 'manager' | 'admin';

/**
 * Represents userdata
 */
export class User {
    public expires?: Date;
    public token?: JWTToken;
    public data?: UserDetails;
}

/**
 * JWT Token
 */
export type JWTToken = {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
    'not-before-policy': number;
    session_state: string;
    scope: string;
};

/**
 * JWT Error
 */
export type JWTError = {
    error: string;
    error_description: string;
};

/**
 * Keycloak user details
 */
export type UserDetails = {
    email: string;
    sub: string;
    email_verified: boolean;
    family_name: string;
    given_name: string;
    groups: string[];
    locale: string;
    name: string;
    preferred_username: string;
    roles: string[];
    auth_time: number;
    exp: number;
};
/* vim: set expandtab ts=4 sw=4 sts=4: */
