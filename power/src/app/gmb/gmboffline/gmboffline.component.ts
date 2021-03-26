import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'power-gmboffline',
    templateUrl: './gmboffline.component.html',
    styleUrls: ['./gmboffline.component.scss']
})
export class GmbofflineComponent implements OnInit {

    mode = undefined;

    constructor(
        private titleService: Title,
        private meta: Meta,
        private route: ActivatedRoute,
    ) {
        this.changeTitle();
    }

    changeTitle() {
        if (this.mode === 'gmb') {
            this.titleService.setTitle($localize`Grundstücksmarktberichte (Archiv) - Immobilienmarkt.NI`);
            this.meta.updateTag({ name: 'description', content: $localize`Kostenloser Zugriff auf die Grundstücksmarktberichte der Landkreise von Niedersachsen` });
            this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Grundstücksmarktberichte, Landkreis` });
        } else if (this.mode === 'lmb') {
            this.titleService.setTitle($localize`Landesgrundstücksmarktberichte (Archiv) - Immobilienmarkt.NI`);
            this.meta.updateTag({ name: 'description', content: $localize`Kostenloser Zugriff auf die Landesgrundstücksmarktberichte von Niedersachsen` });
            this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Landesgrundstücksmarktberichte` });
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
