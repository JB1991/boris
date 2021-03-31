import { ErrorHandler, Injectable, Inject, LOCALE_ID } from '@angular/core';

import { UpdateService } from './update.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(@Inject(LOCALE_ID) public locale: string,
        public alerts: AlertsService,
        public us: UpdateService) { }

    handleError(error: Error) {
        // check if app needs reload
        console.error(error);
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            console.error(error);
            this.us.cleanupServiceWorker();
            this.reload();
            return;
        }

        // craft error
        const msg = btoa(location.href + '\n' + navigator.userAgent + '\n\n' + error.toString() + '\n' + error?.stack);

        // show error
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0px';
        container.style.left = '0px';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'auto';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#FFFFFF';
        container.classList.add('p-3');

        const text = document.createElement('div');
        text.innerText = $localize`Ein Fehler ist aufgetreten, um den Fehler zu beheben, versuchen Sie bitte folgendes: Löschen Sie den Browser-Cache, deaktivieren Sie alle Browser-Plugins und aktualisieren Sie Ihren Webbrowser. Sollten diese Schritte Ihr Problem nicht beheben, dann kontaktieren Sie uns bitte mit dem untenstehenden Code. Bitte Senden Sie uns den Code als Text und nicht als Screenshot.`;
        container.appendChild(text);

        const mail = document.createElement('div');
        mail.innerText = $localize`Kontakt:` + ' incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com';
        container.appendChild(mail);

        const link = document.createElement('a');
        link.href = 'mailto:incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com?subject=Fehlerbericht&body=' + msg;
        link.innerText = $localize`E-Mail Programm öffnen`;
        container.appendChild(link);

        /* eslint-disable-next-line no-unsanitized/method */
        container.insertAdjacentHTML('beforeend', '<br><br><div class="small"><code>' + msg + '</code></div>');

        document.body.appendChild(container);
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
