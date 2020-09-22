import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuthService } from '@app/shared/auth/auth.service';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public form: any = null;
    public tasksList: any = [];
    public tasksCountTotal = 0;
    public tasksPerPage = 5;

    constructor(private httpClient: HttpClient,
        public auth: AuthService) {
    }

    /**
     * Resets service to empty model
     */
    public resetService() {
        this.form = null;
        this.tasksList = [];
        this.tasksCountTotal = 0;
        this.tasksPerPage = 5;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
