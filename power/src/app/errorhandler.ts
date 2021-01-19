import { ErrorHandler, Injectable } from '@angular/core';

import { AlertsService } from '@app/shared/alerts/alerts.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(public alerts: AlertsService) { }

    handleError(error) {
        // show message
        this.alerts.NewAlert('danger', $localize`Ein unbekannter Fehler ist aufgetreten`,
            $localize`Bitte laden Sie die Webseite neu und versuchen es erneut. Sollte der Fehler wieder auftreten, dann senden Sie uns bitte Feedback.`,
            30000);

        // print error
        // console.log(error);
        throw error;
    }
}
