import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '../../alerts/alerts.service';
import { StorageService } from '../storage.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-modal-formular',
  templateUrl: './modal-formular.component.html',
  styleUrls: ['./modal-formular.component.css']
})
export class ModalFormularComponent implements OnInit {
  @ViewChild('modalformular') private modal: ModalDirective;

  public tabSelected = 0;
  private backup: string;

  constructor(private modalService: BsModalService,
              private alerts: AlertsService,
              public storage: StorageService,
              public history: HistoryService) {
  }

  ngOnInit() {
  }

  /**
   * Opens configure formular midal
   */
  public Open() {
    this.storage.SetAutoSaveEnabled(false);
    this.tabSelected = 0;
    this.backup = JSON.stringify(this.storage.model);

    this.modal.config.keyboard = false;
    this.modal.config.ignoreBackdropClick = true;
    this.modal.show();
  }

  /**
   * Closes configure survey modal
   */
  public Close() {
    // check if formular changed
    if (this.backup !== JSON.stringify(this.storage.model)) {
      // ask user to continue
      if (!confirm('Änderungen werden nicht gespeichert, fortfahren?')) {
        return;
      }

      // restore data
      this.storage.model = JSON.parse(this.backup);
    }

    this.storage.SetAutoSaveEnabled(true);
    this.modal.hide();
  }

  /**
   * Saves and closes configure survey modal
   */
  public Save() {
    // check if form is filled incorrect
    if (document.getElementsByClassName('is-invalid').length > 0) {
      this.alerts.NewAlert('danger', 'Ungültige Einstellungen', 'Einige Einstellungen sind fehlerhaft und müssen zuvor korrigiert werden.');
      return;
    }

    // check if formular changed
    if (this.backup !== JSON.stringify(this.storage.model)) {
      this.history.MakeHistory(JSON.parse(this.backup));
      this.storage.model = JSON.parse(JSON.stringify(this.storage.model));
    }

    this.storage.SetAutoSaveEnabled(true);
    this.modal.hide();
  }

  /**
   * Changes tab in configure survey modal
   * @param tab Tab index to open
   */
  public SelectTab(tab: number = 0) {
    // check if form is filled incorrect
    if (document.getElementsByClassName('is-invalid').length > 0) {
      this.alerts.NewAlert('danger', 'Ungültige Einstellungen', 'Einige Einstellungen sind fehlerhaft und müssen zuvor korrigiert werden.');
      return;
    }

    // check if tab is already selected or does not exist
    if (tab === this.tabSelected || tab > this.storage.model.pages.length) {
      return;
    }
    this.tabSelected = tab;
  }
}
