import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { PublicForm, PublicFormFilter, PublicFormField } from '../formapi.model';
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
    public sort: PublicFormField = 'extract';
    public desc = true;

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

    public changeFormSort(sort: PublicFormField) {
        if (this.sort === sort) {
            this.desc = !this.desc;
        } else {
            this.desc = false;
        }
        this.sort = sort;
        this.update(false);
    }

    // tslint:disable-next-line: max-func-body-length
    public async update(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetPublicFormsParams = {
                fields: ['id', 'content', 'tags', 'access', 'extract'],
                extract: ['title.de', 'title.default'],
                limit: Number(this.perPage),
                offset: (this.page - 1) * this.perPage,
            };
            params.sort = { field: this.sort, desc: this.desc };
            const filters: Array<PublicFormFilter> = [
                { access: 'public' },
            ];
            if (this.search !== '') {
                const or: Array<PublicFormFilter> = [];
                const search = { lower: true, contains: this.search };
                or.push({ extract: search });
                or.push({ tag: search });
                filters.push({ or: or });
            }
            params.filter = { and: filters };

            const response = await this.formAPI.getPublicForms(params);
            this.data = response.forms;
            this.total = response.total;
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
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            /* istanbul ignore else */
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }
}
