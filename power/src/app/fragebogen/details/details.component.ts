import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-formulars-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private titleService: Title,
              private router: Router,
              private route: ActivatedRoute,
              private alerts: AlertsService,
              private loadingscreen: LoadingscreenService) {
    this.titleService.setTitle('LGLN - POWER.NI');
  }

  ngOnInit() {
    this.alerts.NewAlert("danger", "Test", "A");
  }
}
