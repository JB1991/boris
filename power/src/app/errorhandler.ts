import { ErrorHandler, Injectable, Inject, LOCALE_ID } from '@angular/core';

import { UpdateService } from './update.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(@Inject(LOCALE_ID) public locale: string,
        public alerts: AlertsService,
        public us: UpdateService) { }

    handleError(error) {
        // check if app needs reload
        console.error(error);
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            console.error(error);
            this.us.cleanupServiceWorker();
            this.reload();
            return;
        }

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

        container.innerText = $localize`Ein kritischer Fehler ist aufgetreten, nachfolgender Code enhält die notwendigen Informationen für unsere Entwickler. Bitte Senden Sie uns den Code als Text und nicht als Screenshot.`;
        /* eslint-disable-next-line no-unsanitized/method */
        container.insertAdjacentHTML('beforeend', '<br><br><div class="small"><code>' +
            btoa(navigator.userAgent + '\n\n' + error.stack) + '</code></div>');

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
