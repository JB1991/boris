import { GlobalErrorHandler } from './errorhandler';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { UpdateService } from './update.service';

describe('GlobalErrorHandler', () => {
    let handler: GlobalErrorHandler;

    beforeEach(() => {
        const alerts = new AlertsService();
        spyOn(alerts, 'NewAlert');
        spyOn(console, 'error');

        handler = new GlobalErrorHandler('de', alerts, Platform.prototype, new MockUpdateService() as UpdateService, HttpClient.prototype);
        spyOn(handler, 'reload');
        spyOn(handler.http, 'post');
    });

    it('should be created', () => {
        expect(handler).toBeTruthy();
    });

    it('should handle error', () => {
        handler.handleError(new Error('Fatal error: Out of pizza (allocated 8 pieces) (tried to allocate 1 more piece)'));
        expect(handler.reload).toHaveBeenCalledTimes(0);
    });

    it('should handle error 2', () => {
        handler.container = document.createElement('div');
        document.body.append(handler.container);
        handler.handleError(new Error('Fatal error: Out of pizza (allocated 8 pieces) (tried to allocate 1 more piece)'));
        expect(handler.reload).toHaveBeenCalledTimes(0);
    });

    it('should reload on chunk error', () => {
        handler.handleError(new Error('Loading chunk 0 failed'));
        expect(handler.reload).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        // remove error screen
        if (handler.container) {
            document.body.removeChild(handler.container);
        }
        handler.errorList = [];
        handler.container = undefined;
    });
});

class MockUpdateService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public cleanupServiceWorker(del: boolean) { }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
