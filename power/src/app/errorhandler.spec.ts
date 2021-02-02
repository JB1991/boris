import { GlobalErrorHandler } from './errorhandler';
import { UpdateService } from './update.service';

import { AlertsService } from '@app/shared/alerts/alerts.service';

describe('GlobalErrorHandler', () => {
    let handler: GlobalErrorHandler;

    beforeEach(() => {
        const alerts = new AlertsService();
        spyOn(alerts, 'NewAlert');
        handler = new GlobalErrorHandler('de', alerts, new MockUpdateService() as UpdateService);
    });

    it('should be created', () => {
        expect(handler).toBeTruthy();
    });

    it('should handle error', () => {
        expect(() => {
            handler.handleError(new Error('Fatal error: Out of pizza (allocated 8 pieces) (tried to allocate 1 more piece)'));
        }).toThrowError('Fatal error: Out of pizza (allocated 8 pieces) (tried to allocate 1 more piece)');
    });
});

class MockUpdateService {
    public cleanupServiceWorker() { }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
