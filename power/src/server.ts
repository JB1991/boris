import 'zone.js/node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { createWindow } from 'domino';

import { AppServerModule } from './main.server';
import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { enableProdMode } from '@angular/core';

enableProdMode();
const template = readFileSync(join('dist/power/browser/de', 'index.html')).toString();
const window = createWindow(template);

(global as any).window = window;
(global as any).window.URL = {};
(global as any).getComputedStyle = window.getComputedStyle;
(global as any).self = {};
const createObjectURL = require('create-object-url');
(global as any).window.URL.createObjectURL = createObjectURL;
(global as any).document = window.document;
(global as any).navigator = window.navigator;
(global as any).location = window.location;
(global as any).localStorage = window.localStorage;
(global as any).HTMLElement = (window as any).HTMLElement;
(global as any).HTMLElement.prototype.getBoundingClientRect = function () {
    return {
        left: '',
        right: '',
        top: '',
        bottom: ''
    }
};
const Blobx = require('node-blob');
(global as any).Blob = Blobx;

// The Express app is exported so that it can be used by serverless Functions.
export function app(lang: string): express.Express {
    const server = express();
    const distFolder = join(process.cwd(), `dist/power/browser/${lang}`);
    const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

    // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
    server.engine('html', ngExpressEngine({
        bootstrap: AppServerModule,
        inlineCriticalCss: false,
        extraProviders: [{ provide: LOCALE_ID, useValue: lang }],
    } as any));

    server.set('view engine', 'html');
    server.set('views', distFolder);

    // Example Express Rest API endpoints
    // server.get('/api/**', (req, res) => { });
    // Serve static files from /browser
    server.get('*.*', express.static(distFolder, {
        maxAge: '1y',
        redirect: false
    }));

    // All regular routes use the Universal engine
    server.get('*', (req, res) => {
        /* eslint-disable object-shorthand */
        res.render(indexHtml, {
            req,
            providers: [
                {
                    provide: APP_BASE_HREF,
                    useValue: req.baseUrl
                }, {
                    provide: LOCALE_ID,
                    useValue: lang
                }
            ]
        });
    });

    return server;
}

function run(): void {
    const port = process.env['PORT'] || 4000;
    const appDE = app('de');
    const appDESIMPLE = app('de-simple');
    const appEN = app('en');

    // Start up the Node server
    const server = express();
    server.use('', appDE);
    server.use('/de-simple', appDESIMPLE);
    server.use('/en', appEN);
    server.listen(port, () => {
        console.info(`Node Express server listening on http://localhost:${port}`);
    });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
    run();
}

export * from './main.server';
