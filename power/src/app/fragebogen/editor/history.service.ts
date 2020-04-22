import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * HistoryService creates snapshots of the data model to undo and redo changes
 */
@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private undoBuffer: any = [];
  private redoBuffer: any = [];
  public undoIndex = 0;
  public redoIndex = 0;

  constructor(public storage: StorageService) { }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.undoBuffer = [];
    this.redoBuffer = [];
    this.undoIndex = 0;
    this.redoIndex = 0;
  }

  /**
   * Creates history to undo things
   * @param data JSON data
   * @param del True to delete future
   */
  public makeHistory(data: any, del: boolean = true) {
    this.storage.setUnsavedChanges(true);
    this.undoBuffer[this.undoIndex] = JSON.stringify(data);
    this.undoIndex++;

    // limit size
    if (this.undoIndex > 10) {
      this.undoIndex--;
      delete this.undoBuffer[0];
    }

    // delete future
    if (del) {
        this.redoBuffer = [];
        this.redoIndex = 0;
    }
  }

  /**
   * Creates future to redo things
   * @param data JSON data
   */
  public makeFuture(data: any) {
    this.storage.setUnsavedChanges(true);
    this.redoBuffer[this.redoIndex] = JSON.stringify(data);
    this.redoIndex++;

    // limit size
    if (this.redoBuffer > 10) {
      this.redoIndex--;
      delete this.redoBuffer[0];
    }
  }

  /**
   * Undo last change
   */
  public undoChanges(): any {
    // check if future exists
    if (this.undoIndex < 1) {
      return;
    }

    // reduce index
    this.undoIndex--;
    if (typeof this.undoBuffer[this.undoIndex] === 'undefined') {
      throw new Error('History does not exists');
    }

    // restore
    this.makeFuture(this.storage.model);
    delete this.undoBuffer[this.undoIndex + 1];
    this.storage.model = JSON.parse(this.undoBuffer[this.undoIndex]);

    // check if selected page exists
    if (this.storage.selectedPageID >= this.storage.model.pages.length) {
      this.storage.selectedPageID = this.storage.model.pages.length - 1;
    }
  }

  /**
   * Redo last change
   */
  public redoChanges(): any {
    // check if history exists
    if (this.redoIndex < 1) {
      return;
    }

    // reduce index
    this.redoIndex--;
    if (typeof this.redoBuffer[this.redoIndex] === 'undefined') {
      throw new Error('Future does not exists');
    }

    // restore
    this.makeHistory(this.storage.model, false);
    delete this.redoBuffer[this.redoIndex + 1];
    this.storage.model = JSON.parse(this.redoBuffer[this.redoIndex]);

    // check if selected page exists
    if (this.storage.selectedPageID >= this.storage.model.pages.length) {
      this.storage.selectedPageID = this.storage.model.pages.length - 1;
    }
  }
}
