import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
        private route: ActivatedRoute,
    ) {
        this.changeTitle();
    }

    changeTitle() {
        if (this.mode === 'gmb') {
            this.titleService.setTitle($localize`Grundstücksmarktberichte (Archiv)`);
        } else if (this.mode === 'lmb') {
            this.titleService.setTitle($localize`Landesgrundstücksmarktberichte (Archiv)`);
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
