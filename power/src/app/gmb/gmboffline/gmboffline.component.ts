import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-gmboffline',
    templateUrl: './gmboffline.component.html',
    styleUrls: ['./gmboffline.component.scss']
})
export class GmbofflineComponent implements OnInit {

    public mode?: string = undefined;

    constructor(
        private route: ActivatedRoute,
        private seo: SEOService
    ) {
        this.changeTitle();
    }

    public changeTitle() {
        if (this.mode === 'gmb') {
            this.seo.setTitle($localize`Grundstücksmarktberichte (Archiv) - Immobilienmarkt.NI`);
            this.seo.updateTag({ name: 'description', content: $localize`Grundstücksmarktberichte geben einen fundierten Einblick in das Geschehen am Grundstücksmarkt, insbesondere über Umsätze, Preisentwicklungen und Preisniveau in den Teilmärkten.` });
            this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Grundstücksmarktbericht, Landkreis, Download, Grundstücksmarkt, Grundstück, Entwicklung, Umsatz, Bauland, Bodenrichtwert, Haus, Wohnung, Miete` });
        } else if (this.mode === 'lmb') {
            this.seo.setTitle($localize`Landesgrundstücksmarktberichte (Archiv) - Immobilienmarkt.NI`);
            this.seo.updateTag({ name: 'description', content: $localize`Der Landesgrundstücksmarktbericht gibt einen Überblick über Immobilienverkäufe in Niedersachsen. Er ist das Ergebnis der Auswertung sämtlicher Grundstückskaufverträge durch die Gutachterausschüsse für Grundstückswerte.` });
            this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Landesgrundstücksmarktbericht, Download, Grundstücksmarkt, Grundstück, Entwicklung, Umsatz, Bauland, Bodenrichtwert, Haus, Wohnung, Miete` });
        }
    }

    /**
     * OnInit
     * Load geojson for Landkreise
     */
    public ngOnInit(): void {
        this.route.data.subscribe(routedata => {
            if (routedata['mode'] === 'lmb') {
                this.mode = 'lmb';
            }
            if (routedata['mode'] === 'gmb') {
                this.mode = 'gmb';
            }
            this.changeTitle();
        });
    }

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
