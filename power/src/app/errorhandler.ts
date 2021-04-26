import { ErrorHandler, Injectable, Inject, LOCALE_ID } from '@angular/core';
import { environment } from '@env/environment';

import { UpdateService } from './update.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public errorList: Error[] = [];
    public container: HTMLDivElement;

    constructor(@Inject(LOCALE_ID) public locale: string,
        public alerts: AlertsService,
        public us: UpdateService) { }

    handleError(error: Error) {
        // check if app needs reload
        console.error(error);
        if (error.message.indexOf('Loading chunk') !== -1) {
            console.error(error);
            this.us.cleanupServiceWorker();
            this.reload();
            return;
        }
        this.errorList.splice(0, 0, error);

        // craft error
        let msgStr = location.href + '\n' + navigator.userAgent + '\n' + environment.config.version.branch + '/' + environment.config.version.version;
        for (const err of this.errorList) {
            msgStr += '\n\n' + err.toString() + '\n' + err?.stack;
        }
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
        this.container.classList.add('p-3');

        const text = document.createElement('div');
        text.innerText = $localize`Ein Fehler ist aufgetreten, um den Fehler zu beheben, versuchen Sie bitte folgendes: Löschen Sie den Browser-Cache, deaktivieren Sie alle Browser-Plugins und aktualisieren Sie Ihren Webbrowser. Sollten diese Schritte Ihr Problem nicht beheben, dann kontaktieren Sie uns bitte mit dem untenstehenden Code. Bitte Senden Sie uns den Code als Text und nicht als Screenshot.`;
        this.container.appendChild(text);

        const mail = document.createElement('div');
        mail.innerText = $localize`Kontakt:` + ' incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com';
        this.container.appendChild(mail);

        const link = document.createElement('a');
        link.href = 'mailto:incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com?subject=Fehlerbericht&body=' + msgB64;
        link.innerText = $localize`E-Mail Programm öffnen`;
        this.container.appendChild(link);

        /* eslint-disable-next-line no-unsanitized/method */
        this.container.insertAdjacentHTML('beforeend', '<br><br><div class="small"><code>' + msgB64 + '</code></div>');

        document.body.appendChild(this.container);
        document.body.classList.add('overflow-hidden');
    }

    /**
     * Reloads page
     */
    /* istanbul ignore next */
    public reload() {
        window.location.reload();
    }
}
