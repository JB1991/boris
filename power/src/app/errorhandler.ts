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
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            // this.us.cleanupServiceWorker();
            window.location.reload();
            return;
        }

        // show message
        this.alerts.NewAlert('danger', $localize`Ein unbekannter Fehler ist aufgetreten`,
            $localize`Bitte laden Sie die Webseite neu und versuchen es erneut. Sollte der Fehler wieder auftreten, dann senden Sie uns bitte Feedback.`,
            30000);

        // print error
        // window.location.replace(location.protocol + '//' + location.host +
        // (this.locale === 'de' ? '' : '/' + this.locale));
        // console.error(error);
        throw error;
    }
}
