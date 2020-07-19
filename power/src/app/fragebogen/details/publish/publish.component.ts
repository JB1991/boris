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
  @ViewChild('modalpublish') public modal: ModalDirective;
  public pin = 'pin8';
  public accesstime = 60;

  constructor(public modalService: BsModalService,
              public alerts: AlertsService,
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
  public close() {
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
        const alertText = (data && data['error'] ? data['error'] : this.storage.form.id);
        this.alerts.NewAlert('danger', 'Veröffentlichen fehlgeschlagen', alertText);

        console.log('Could not publish form: ' + alertText);
        return;
      }

      // success
      this.storage.form = data['data'];
      this.alerts.NewAlert('success', 'Formular veröffentlicht', 'Das Formular wurde erfolgreich veröffentlicht.');
      this.close();
    }, (error: Error) => {
        // failed to publish form
        this.alerts.NewAlert('danger', 'Veröffentlichen fehlgeschlagen', error['statusText']);
        console.log(error);
        return;
    });
  }
}
