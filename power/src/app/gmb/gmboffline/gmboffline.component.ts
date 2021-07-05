import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-gmboffline',
    templateUrl: './gmboffline.component.html',
    styleUrls: ['./gmboffline.component.scss']
})
export class GmbofflineComponent implements OnInit {

    mode = undefined;

    constructor(
        private route: ActivatedRoute,
        private seo: SEOService
    ) {
        this.changeTitle();
    }

    changeTitle() {
        if (this.mode === 'gmb') {
            this.seo.setTitle($localize`Grundstücksmarktberichte (Archiv) - Immobilienmarkt.NI`);
            this.seo.updateTag({ name: 'description', content: $localize`Gebührenfreier Zugriff auf die Grundstücksmarktberichte der Landkreise von Niedersachsen` });
            this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Grundstücksmarktberichte, Landkreis` });
        } else if (this.mode === 'lmb') {
            this.seo.setTitle($localize`Landesgrundstücksmarktberichte (Archiv) - Immobilienmarkt.NI`);
            this.seo.updateTag({ name: 'description', content: $localize`Gebührenfreier Zugriff auf die Landesgrundstücksmarktberichte von Niedersachsen` });
            this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Landesgrundstücksmarktberichte` });
        }
    }

    /**
     * OnInit
     * Load geojson for Landkreise
     */
    ngOnInit(): void {
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
