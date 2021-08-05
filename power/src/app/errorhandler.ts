import { ErrorHandler, Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Platform } from '@angular/cdk/platform';

import { UpdateService } from './update.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public errorList: Error[] = [];
    public container: HTMLDivElement;

    constructor(@Inject(LOCALE_ID) public locale: string,
        public alerts: AlertsService,
        public platform: Platform,
        public us: UpdateService,
        public http: HttpClient) { }

    /** @inheritdoc */
    handleError(error: Error): void {
        // check if app needs reload
        console.error(error);
        if (error.message.indexOf('Loading chunk') !== -1) {
            console.error(error);
            this.us.cleanupServiceWorker(true);
            this.reload();
            return;
        }
        this.errorList.splice(0, 0, error);

        // craft error
        let msgStr = location.href + '\n' + navigator.userAgent + '\n' + environment.config.version.branch + '/' + environment.config.version.version;
        for (const err of this.errorList) {
            msgStr += '\n\n' + err.toString() + '\n' + /* istanbul ignore next */ err?.stack;
        }

        // Post data to Bakend
        /* istanbul ignore next */
        this.http.post<any>('/report', msgStr)?.subscribe(data => {
        })

        // Encode Error Message
        const msgB64 = btoa(unescape(encodeURIComponent(msgStr)));

        // show error
        if (this.container) {
            document.body.removeChild(this.container);
        }
        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.top = '0px';
        this.container.style.left = '0px';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.overflow = 'auto';
        this.container.style.zIndex = '9999';
        this.container.style.backgroundColor = '#FFFFFF';
        this.container.className = 'p-3';

        const text = document.createElement('div');
        /* istanbul ignore else */
        if (!(this.platform.SAFARI || this.platform.FIREFOX || this.platform.BLINK)) {
            text.innerText = $localize`Ihr Webbrowser ist veraltet und wird von uns nicht unterstützt. Bitte verwenden Sie einen aktuelleren Webbrowser, wie Google Chrome oder Mozilla Firefox.` + ' ';
        }
        text.innerText += $localize`Ein Fehler ist aufgetreten, um den Fehler zu beheben, versuchen Sie bitte folgendes: Löschen Sie den Browser-Cache, deaktivieren Sie alle Browser-Plugins und aktualisieren Sie Ihren Webbrowser. Sollten diese Schritte Ihr Problem nicht beheben, dann kontaktieren Sie uns bitte mit dem untenstehenden Code. Bitte Senden Sie uns den Code als Text und nicht als Screenshot.`;
        this.container.appendChild(text);


        const mail = document.createElement('div');
        mail.innerText = $localize`Kontakt:` + ' incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com';
        this.container.appendChild(mail);

        const link = document.createElement('a');
        /* eslint-disable-next-line scanjs-rules/assign_to_href */
        link.href = 'mailto:incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com?subject=Fehlerbericht&body=' + msgB64;
        link.innerText = $localize`E-Mail Programm öffnen`;
        this.container.appendChild(link);

        /* eslint-disable-next-line no-unsanitized/method */
        this.container.insertAdjacentHTML('beforeend', '<br><br><div class="small"><code>' + msgB64 + '</code></div>');

        document.body.appendChild(this.container);
        document.body.className += ' overflow-hidden';
    }

    /* istanbul ignore next */
    /**
     * Reloads page
     */
    public reload(): void {
        window.location.reload();
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
