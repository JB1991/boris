import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { PublicForm, PublicFormFilter, PublicFormField } from '../formapi.model';
import { FormAPIService, GetPublicFormsParams } from '../formapi.service';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-public-dashboard',
    templateUrl: './public-dashboard.component.html',
    styleUrls: ['./public-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PublicDashboardComponent implements OnInit {
    public data = new Array<PublicForm>();
    public total = 0;
    public page = 1;
    public perPage = 5;
    public pageSizes?: number[];
    public totalPages?: number;
    public search = '';
    public sort: PublicFormField = 'extract';
    public desc = false;

    constructor(
        /* eslint-disable-next-line @typescript-eslint/ban-types */
        @Inject(PLATFORM_ID) public platformId: Object,
        public router: Router,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formAPI: FormAPIService,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Öffentliche Formulare - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Ausfüllen von online Formularen und Anträgen` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Formulare, Anträge` });
    }

    /** @inheritdoc */
    public ngOnInit(): void {
        /* istanbul ignore else */
        if (isPlatformBrowser(this.platformId)) {
            void this.update(true);
        }
    }

    public changeFormSort(sort: PublicFormField): void {
        if (this.sort === sort) {
            this.desc = !this.desc;
        } else {
            this.desc = false;
        }
        this.sort = sort;
        void this.update(false);
    }

    public async update(navigate: boolean): Promise<void> {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetPublicFormsParams = {
                fields: ['id', 'content', 'tags', 'access', 'extract'],
                extract: ['title.de', 'title.default'],
                limit: Number(this.perPage),
                offset: (this.page - 1) * this.perPage
            };
            params.sort = { field: this.sort, desc: this.desc };
            const filters: PublicFormFilter[] = [
                { access: 'public' }
            ];
            if (this.search !== '') {
                const or: PublicFormFilter[] = [];
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
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formAPI.getErrorMessage(error));
            /* istanbul ignore else */
            if (navigate) {
                void this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    /**
     * Returns value of change event
     * @param event Change Event
     * @returns Value
     */
    public getHTMLInputValue(event: Event): any {
        return (event.target as HTMLInputElement).value;
    }
}
