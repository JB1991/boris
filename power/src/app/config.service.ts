import { Injectable } from '@angular/core';

export interface Config {
    modules: Array<string>;
    authentication: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    public config: Config = { modules: [], authentication: true };
    public appVersion: any = { version: 'local', branch: 'dev' };

    constructor() { }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
