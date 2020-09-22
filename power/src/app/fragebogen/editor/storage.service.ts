import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import * as templates from './data';
import { Bootstrap4_CSS } from '@app/fragebogen/surveyjs/style';
import { AuthService } from '@app/shared/auth/auth.service';

/**
 * StorageService handles loading and saving formulars for the editor component
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public model: any = JSON.parse(JSON.stringify(templates.defaultTemplate));
    public css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));
    public FormularFields = templates.FormularFields;
    public selectedPageID = 0;
    public selectedElementID: number = null;
    public UnsavedChanges = false;
    public AutoSaveEnabled = true;

    constructor(private httpClient: HttpClient,
        public auth: AuthService) { }

    /**
     * Resets service to empty model
     */
    public resetService() {
        this.model = JSON.parse(JSON.stringify(templates.defaultTemplate));
        this.css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));
        // overwrite style class
        this.css_style.root = 'sv_main sv_bootstrap_css bg-light';
        this.css_style.container = '';
        this.css_style.row = 'sv_row';

        this.FormularFields = templates.FormularFields;
        this.selectedPageID = 0;
        this.selectedElementID = null;
        this.UnsavedChanges = false;
        this.AutoSaveEnabled = true;
    }

    /**
     * Sets unsaved changes state
     * @param state true or false
     */
    public setUnsavedChanges(state: boolean) {
        this.UnsavedChanges = state;
    }

    /**
     * Returns true if unsaved changes exists
     */
    public getUnsavedChanges(): boolean {
        return this.UnsavedChanges;
    }

    /**
     * Enables or disables autosave
     * @param state true or false
     */
    public setAutoSaveEnabled(state: boolean) {
        this.AutoSaveEnabled = state;
    }

    /**
     * Returns true if autosave is enabled
     */
    public getAutoSaveEnabled(): boolean {
        return this.AutoSaveEnabled;
    }

    /**
     * Get next unique page id
     */
    public newPageID(): string {
        // first page id 'p1'
        const prefix = 'p';
        let counter = 1;

        // for every page
        for (let i = 0; i < this.model.pages.length; i++) {
            // check if id exists
            if (this.model.pages[i].name === prefix + counter) {
                // id found, increment counter and reset loop
                counter++;
                i = -1;
            }
        }

        // return new id
        return prefix + counter;
    }

    /**
     * Get next unique element id
     */
    public newElementID(): string {
        // first element id 'e1'
        const prefix = 'e';
        let counter = 1;

        // for every page
        for (let i = 0; i < this.model.pages.length; i++) {
            // for every element
            for (const element of this.model.pages[i].elements) {
                // check if id exists
                if (element.name === prefix + counter) {
                    // id found, increment counter and reset loop
                    counter++;
                    i = -1;
                    break;
                }
            }
        }

        // return new id
        return prefix + counter;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
