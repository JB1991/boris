import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env/environment';

import { SEOService } from './seo.service';

describe('SEOService', () => {
    let service: SEOService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ]
        });
        service = TestBed.inject(SEOService);
        spyOn(console, 'error');
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should update canonical url', () => {
        // create link
        const lnk = document.createElement('link');
        lnk.rel = 'canonical';
        service.doc.head.appendChild(lnk);

        // update url
        service.updateCanonicalURL('/shop?id=420');
        const links = service.doc.head.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (links[i].getAttribute('rel') === 'canonical') {
                expect(links[i].href).toEqual(service.BASE_URL + '/en-US/shop');
                return;
            }
        }
        // fail always
        expect(false).toEqual(true);
    });

    it('should update canonical url 2', () => {
        // create link
        const lnk = document.createElement('link');
        lnk.rel = 'canonical';
        service.doc.head.appendChild(lnk);

        // update url
        service.locale = 'de';
        service.updateCanonicalURL('/shop');
        const links = service.doc.head.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (links[i].getAttribute('rel') === 'canonical') {
                expect(links[i].href).toEqual(service.BASE_URL + '/shop');
                return;
            }
        }
        // fail always
        expect(false).toEqual(true);
    });

    it('should set/get title', () => {
        service.setTitle('Echo');
        expect(service.getTitle()).toEqual('Echo');
    });

    it('should set/get robots', () => {
        service.setAllowRobots(false);
        expect(service.getAllowRobots()).toEqual(false);

        service.setAllowRobots(true);
        expect(service.getAllowRobots()).toEqual(true);
    });

    it('should add/del url params', () => {
        // add param
        service.addURLParameter('id');
        expect(service.URL_PARAMETER).toEqual(['id']);

        // dont add twice
        service.addURLParameter('id');
        expect(service.URL_PARAMETER).toEqual(['id']);

        // delete param
        expect(service.delURLParameter('id')).toBeTrue();
        expect(service.URL_PARAMETER).toEqual([]);

        // param not in list
        expect(service.delURLParameter('id')).toBeFalse();
    });

    it('should not strip whitelisted url params', () => {
        service.addURLParameter('id');
        expect(service.stripURL('/shop?id=420&session=01fa')).toEqual('/shop?id=420');
    });

    it('should update alternative languages', () => {
        // set languages
        environment.config.languages = [
            { short: 'de', name: 'Deutsch', url: '' },
            { short: 'de-simple', name: 'Einfache Sprache', url: '/de-simple' },
            { short: 'en', name: 'English', url: '/en' }
        ];
        service.locale = 'de';

        // expect no alternate langs to be present, add en
        service.updateAlternateLangs('/shop');
        const links = service.doc.head.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (links[i].getAttribute('rel') === 'alternate') {
                expect(links[i].href).toEqual(service.BASE_URL + '/en/shop');
            }
        }

        // navigate to other page
        service.updateAlternateLangs('/imprint');
        for (let i = 0; i < links.length; i++) {
            if (links[i].getAttribute('rel') === 'alternate') {
                expect(links[i].href).toEqual(service.BASE_URL + '/en/imprint');
            }
        }
    });
});
