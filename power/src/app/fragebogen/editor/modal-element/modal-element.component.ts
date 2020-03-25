import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '../../alerts/alerts.service';
import { StorageService } from '../storage.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-modal-element',
  templateUrl: './modal-element.component.html',
  styleUrls: ['./modal-element.component.css']
})
export class ModalElementComponent implements OnInit {
  @ViewChild('modalelement') private modal: ModalDirective;

  public tabSelected = 0;
  private backup: string;
  public ceHasAnswers = ['radiogroup', 'checkbox', 'imagepicker'];
  public ceHasValidators = ['text', 'comment', 'radiogroup', 'checkbox'];

  constructor(private modalService: BsModalService,
              private alerts: AlertsService,
              public storage: StorageService,
              public history: HistoryService) {
  }

  ngOnInit() {
  }

  /**
   * Opens modal to configure element
   * @param element Element number
   * @param page Page number
   */
  public Open(element: number, page: number) {
    this.storage.SetAutoSaveEnabled(false);
    this.tabSelected = 0;
    this.storage.selectedPageID = page;
    this.storage.selectedElementID = element;
    this.backup = JSON.stringify(this.storage.model);

    this.modal.config.keyboard = false;
    this.modal.config.ignoreBackdropClick = true;
    this.modal.show();
  }

  /**
   * Closes configure element modal
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
    this.storage.selectedElementID = null;
  }

  /**
   * Saves and closes configure element modal
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
    this.storage.selectedElementID = null;
  }

  /**
   * Changes tab in configure element modal
   * @param tab Tab index to open
   */
  public SelectTab(tab: number = 0) {
    // check if form is filled incorrect
    if (document.getElementsByClassName('is-invalid').length > 0) {
      this.alerts.NewAlert('danger', 'Ungültige Einstellungen', 'Einige Einstellungen sind fehlerhaft und müssen zuvor korrigiert werden.');
      return;
    }

    // check if page is already selected
    if (tab === this.tabSelected) {
      return;
    }
    this.tabSelected = tab;
  }

  /**
   * Uploads foto to formular
   * @param i Answer number
   */
  public uploadImage(i: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // image selected
    input.onchange = (e: Event) => {
      const file = e.target['files'][0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // upload success
      reader.onload = () => {
        // downscale image
        var img = new Image();
        img.onload = () => {
          var canvas = document.createElement('canvas'),
          ctx = canvas.getContext("2d"),
          oc = document.createElement('canvas'),
          octx = oc.getContext('2d');

          canvas.width = 300; // destination canvas size
          canvas.height = canvas.width * img.height / img.width;
          var cur = {
            width: Math.floor(img.width * 0.5),
            height: Math.floor(img.height * 0.5)
          }
          oc.width = cur.width;
          oc.height = cur.height;

          octx.drawImage(img, 0, 0, cur.width, cur.height);

          while (cur.width * 0.5 > 300) {
            cur = {
              width: Math.floor(cur.width * 0.5),
              height: Math.floor(cur.height * 0.5)
            };
            octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
          }
          ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

          // save image
          this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].choices[i].imageLink = canvas.toDataURL("image/jpeg");
          input.remove();
        };
        img.src = String(reader.result);
      };
    };
    input.click();
  }

  /**
   * Deletes image
   * @param i Answer number
   */
  public deleteImage(i: number) {
    if (confirm('Möchten Sie wirklich das Bild löschen?')) {
      this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].choices[i].imageLink = '';
    }
  }

  /**
   * Deletes choice option
   */
  public AnswerDel() {
    // dont allow to delete the last option
    if (this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].choices.length < 2) {
      return;
    }
    this.storage.model
      .pages[this.storage.selectedPageID]
      .elements[this.storage.selectedElementID]
      .choices.splice(this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].choices.length - 1, 1);
  }

  /**
   * Adds choice option
   */
  public AnswerAdd() {
    if (this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].type !== 'imagepicker') {
      this.storage.model
        .pages[this.storage.selectedPageID]
        .elements[this.storage.selectedElementID]
        .choices.splice(this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].choices.length, 0, {value: '', text: ''});
    } else {
      this.storage.model
        .pages[this.storage.selectedPageID]
        .elements[this.storage.selectedElementID]
        .choices.splice(this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].choices.length, 0, {value: '', text: '', imageLink: ''});
    }
  }

  /**
   * Deletes choice option
   */
  public MatrixColumnDel() {
    // dont allow to delete the last option
    if (this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].columns.length < 2) {
      return;
    }
    this.storage.model
      .pages[this.storage.selectedPageID]
      .elements[this.storage.selectedElementID]
      .columns.splice(this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].columns.length - 1, 1);
  }

  /**
   * Adds choice option
   */
  public MatrixColumnAdd() {
    this.storage.model
      .pages[this.storage.selectedPageID]
      .elements[this.storage.selectedElementID]
      .columns.splice(this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].columns.length, 0, {value: '', text: ''});
  }

  /**
   * Deletes choice option
   */
  public MatrixRowDel() {
    // dont allow to delete the last option
    if (this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].rows.length < 2) {
      return;
    }
    this.storage.model
      .pages[this.storage.selectedPageID]
      .elements[this.storage.selectedElementID]
      .rows.splice(this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].rows.length - 1, 1);
  }

  /**
   * Adds choice option
   */
  public MatrixRowAdd() {
    this.storage.model
      .pages[this.storage.selectedPageID]
      .elements[this.storage.selectedElementID]
      .rows.splice(this.storage.model.pages[this.storage.selectedPageID].elements[this.storage.selectedElementID].rows.length, 0, {value: '', text: ''});
  }
}
