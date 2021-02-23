import { Injectable } from '@angular/core';

export interface Config {
    modules: Array<string>;
    authentication: boolean;
    localized?: boolean;
}
export interface Version {
    version: string;
    branch: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    public config: Config = { modules: [], authentication: true, localized: false };
    public version: Version = { version: 'local', branch: 'dev' };

    constructor() { }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
