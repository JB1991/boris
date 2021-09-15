import { Component } from '@angular/core';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {

    constructor(private seo: SEOService) {
        this.seo.setTitle($localize`Datenschutz - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Das Immobilienmarkt Portal Niedersachsen stellt gebührenfrei die Bodenrichtwerte, Grundstücksmarktdaten und den Immobilienpreisindex für Niedersachsen bereit.` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwertinformationssystem, Bodenrichtwert, BORIS.NI, BORIS, Bauland, Landwirtschaft, Grundstücksmarktbericht, Landesgrundstücksmarktbericht, Landesgrundstücksmarktdaten, Immobilienpreisindex, NIPIX, Immobilien-Preis-Kalkulator, IPK, OGC, Geodienste, Geodatendienste` });
    }
}
