import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'power-formulars-details-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
  @ViewChild('modalpublish') private modal: ModalDirective;
  public pin = 'pin8';
  public accesstime = 60;

  constructor(private modalService: BsModalService,
              private alerts: AlertsService,
              public storage: StorageService) {
  }

  ngOnInit() {
  }

  /**
   * Opens modal
   */
  public open() {
    this.modal.show();
  }

  /**
   * Closes modal
   */
  public Close() {
    this.modal.hide();
  }

  /**
   * Publishes form
   */
  public Publish() {
    // Ask user to confirm achivation
    if (!confirm('Möchten Sie dieses Formular wirklich veröffentlichen?\n\
Das Formular lässt sich danach nicht mehr bearbeiten.\n\
Dies lässt sich nicht mehr umkehren!')) {
      return;
    }

    // publish form
    this.storage.publishForm(this.storage.form.id, this.pin, this.accesstime).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        const alertText = (data['error'] ? data['error'] : this.storage.form.id);
        this.alerts.NewAlert('danger', 'Veröffentlichen fehlgeschlagen', alertText);

        console.log('Could not publish form: ' + alertText);
        return;
      }

      // success
      this.storage.form = data['data'];
      this.alerts.NewAlert('success', 'Formular veröffentlicht', 'Das Formular wurde erfolgreich veröffentlicht.');
      this.Close();
    }, (error: Error) => {
        // failed to publish form
        this.alerts.NewAlert('danger', 'Veröffentlichen fehlgeschlagen', error['statusText']);
        console.log(error);
        return;
    });
  }
}
