import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService } from '../formapi.service';

@Component({
    selector: 'power-public-dashboard',
    templateUrl: './public-dashboard.component.html',
    styleUrls: ['./public-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PublicDashboardComponent implements OnInit {

    public data: any[];
    public total: number;
    public page: number;
    public perPage: number;
    public pageSizes: number[];

    public title = '';
    public sort: 'title' | 'published' = 'title';
    public order: 'asc' | 'desc' = 'asc';

    constructor(public titleService: Title,
        public router: Router,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formAPI: FormAPIService) {
        this.titleService.setTitle($localize`Öffentliche Formulare - POWER.NI`);
    }

    ngOnInit() {
        this.page = 1;
        this.perPage = 5;
        this.update();
    }

    public changePage(page: number) {
        this.page = page;
        this.update();
    }

    public changePerPage(perPage: number) {
        console.log(perPage);
        this.perPage = perPage;
        this.update();
    }

    public filterByTitle(title: string) {
        this.title = title;
        this.update();
    }

    public changeSort(sort: 'title' | 'published') {
        if (this.sort === sort) {
            if (this.order === 'asc') {
                this.order = 'desc';
            }
        } else {
            this.order = 'asc';
        }
        this.sort = sort;
        this.update();
    }

    public async update() {
        try {
            this.loadingscreen.setVisible(true);
            const params = {
                limit: this.perPage,
                offset: (this.page - 1) * this.perPage,
                sort: this.sort,
                order: this.order,
            };
            if (this.title !== '') {
                params['title-contains'] = this.title;
            }
            const response = await this.formAPI.getPublicForms(params);
            this.data = response.data;
            this.total = response.total;
            const maxPages = Math.floor(this.total / 5) + 1;
            this.pageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            this.loadingscreen.setVisible(false);
        } catch (error) {
            this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error.toString());
            this.router.navigate(['/forms'], { replaceUrl: true });
        }
    }

}
