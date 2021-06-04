import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * HistoryService creates snapshots of the data model to undo and redo changes
 */
@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    public undoBuffer = [];
    public redoBuffer = [];

    constructor(public storage: StorageService) { }

    /**
     * Resets service to empty model
     */
    public resetService(): void {
        this.undoBuffer = [];
        this.redoBuffer = [];
    }

    /**
     * Creates history to undo things
     * @param data JSON data
     * @param del True to delete future
     */
    public makeHistory(data: any, del = true): void {
        // check data
        if (!data) {
            return;
        }
        this.storage.setUnsavedChanges(true);
        this.undoBuffer.push(JSON.stringify(data));

        // limit size
        if (this.undoBuffer.length > 10) {
            this.undoBuffer.splice(0, 1);
        }

        // delete future
        if (del) {
            this.redoBuffer = [];
        }
    }

    /**
     * Creates future to redo things
     * @param data JSON data
     */
    public makeFuture(data: any): void {
        // check data
        if (!data) {
            return;
        }
        this.storage.setUnsavedChanges(true);
        this.redoBuffer.push(JSON.stringify(data));

        // limit size
        if (this.redoBuffer.length > 10) {
            this.redoBuffer.splice(0, 1);
        }
    }

    /**
     * Undo last change
     * @returns True if changes are undone
     */
    public undoChanges(): boolean {
        // check if future exists
        if (this.undoBuffer.length < 1) {
            return false;
        }

        // restore
        this.makeFuture(this.storage.model);
        this.storage.model = JSON.parse(this.undoBuffer.pop());

        // check if selected page exists
        if (this.storage.selectedPageID >= this.storage.model.pages.length) {
            this.storage.selectedPageID = this.storage.model.pages.length - 1;
        }
        return true;
    }

    /**
     * Redo last change
     * @returns True if changes are redone
     */
    public redoChanges(): boolean {
        // check if history exists
        if (this.redoBuffer.length < 1) {
            return false;
        }

        // restore
        this.makeHistory(this.storage.model, false);
        this.storage.model = JSON.parse(this.redoBuffer.pop());

        // check if selected page exists
        if (this.storage.selectedPageID >= this.storage.model.pages.length) {
            this.storage.selectedPageID = this.storage.model.pages.length - 1;
        }
        return true;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
