import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-ogc-services',
    templateUrl: './ogc-services.component.html',
    styleUrls: ['./ogc-services.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OgcServicesComponent {

    constructor(
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`OGC Dienste - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Das LGLN stellt gebührenfreie OGC Darstellungs- und Downloaddienste über WMS und WFS Schnittstellen bereit` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, LGLN, OGC, WMS, WFS, Geodatendienste` });
    }
}
