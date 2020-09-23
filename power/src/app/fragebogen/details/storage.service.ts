import { Injectable } from '@angular/core';

/**
 * StorageService handles data storage
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public form: any = null;
    public tasksList: any = [];
    public tasksCountTotal = 0;
    public tasksPerPage = 5;

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
