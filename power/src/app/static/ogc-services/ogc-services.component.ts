import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'power-ogc-services',
    templateUrl: './ogc-services.component.html',
    styleUrls: ['./ogc-services.component.scss']
})
export class OgcServicesComponent {

    constructor(
        private titleService: Title,
        private meta: Meta
    ) {
        this.titleService.setTitle($localize`OGC Datendienste - Immobilienmarkt.NI`);
        this.meta.updateTag({ name: 'description', content: $localize`Das LGLN stellt gebührenfreie OGC Darstellungs- und Downloaddienste über WMS und WFS Schnittstellen bereit` });
        this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, LGLN, OGC, WMS, WFS, Geodatendienste` });
    }
}
