import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

import { defaultTemplate } from '@app/fragebogen/editor/data';

@Component({
	selector: 'power-forms-details-shareform',
	templateUrl: './shareform.component.html',
	styleUrls: ['./shareform.component.scss']
})
export class ShareformComponent implements OnInit {
	@ViewChild('modalshareform') public modal: ModalDirective;

    public tagList = [];
    public ownerList = [];
    public readerList = [];

	constructor(public modalService: BsModalService,
        public router: Router,
        public alerts: AlertsService,
        public storage: StorageService) {
	}

	ngOnInit() {
	}

    /**
     * Opens new form modal
     */
    public open() {
        this.modal.show();
    }

    /**
     * Closes new form modal
     */
    public close() {
        this.modal.hide();
    }

	public saveSettings() {
		console.log("save");
	}

}
