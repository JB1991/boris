import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { PublicForm, PublicFormFilter } from '../formapi.model';
import { FormAPIService, GetPublicFormsParams } from '../formapi.service';

@Component({
    selector: 'power-public-dashboard',
    templateUrl: './public-dashboard.component.html',
    styleUrls: ['./public-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PublicDashboardComponent implements OnInit {
    public data: Array<PublicForm>;
    public total: number;
    public page = 1;
    public perPage = 5;
    public pageSizes: number[];
    public totalPages: number;
    public search = '';
    public sort: 'id' | 'title' | 'tags' | 'access' = 'title';
    public order: 'asc' | 'desc' = 'asc';

    constructor(public titleService: Title,
        public router: Router,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formAPI: FormAPIService) {
        this.titleService.setTitle($localize`Öffentliche Formulare - POWER.NI`);
    }

    ngOnInit() {
        this.update(true);
    }

    public changeSort(sort: 'id' | 'title' | 'tags' | 'access') {
        if (this.sort === sort) {
            if (this.order === 'asc') {
                this.order = 'desc';
            } else {
                this.order = 'asc';
            }
        } else {
            this.order = 'asc';
        }
        this.sort = sort;
        this.update(false);
    }

    // tslint:disable-next-line: max-func-body-length
    public async update(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetPublicFormsParams = {
                fields: ['all'],
                extra: ['title.de', 'title.default'],
                limit: this.perPage,
                offset: (this.page - 1) * this.perPage,
            };
            if (this.sort === 'title') {
                params.sort = {
                    orderBy: { field: 'content', path: ['title', 'de'] },
                    alternative: { field: 'content', path: ['title', 'default'] },
                    order: this.order,
                };
            } else {
                params.sort = { orderBy: { field: this.sort }, order: this.order };
            }
            const filters: Array<PublicFormFilter> = [];
            if (this.search !== '') {
                const or: Array<PublicFormFilter> = [];
                const search = { lower: true, contains: this.search };
                or.push({ content: { path: ['title', 'de'], text: search } });
                or.push({ content: { path: ['title', 'default'], text: search } });
                or.push({ tag: search });
                filters.push({ or: or });
            }
            if (filters.length > 0) {
                params.filter = { and: filters };
            }
            const response = await this.formAPI.getPublicForms(params);
            this.data = response.forms;
            this.total = response['total-forms'];
            this.totalPages = Math.ceil(this.total / this.perPage);
            let maxPages = Math.floor(this.total / 5) + 1;
            if (maxPages > 10) {
                maxPages = 10;
                this.pageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            } else {
                this.pageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            }
            this.loadingscreen.setVisible(false);
        } catch (error) {
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            /* istanbul ignore else */
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }
}
