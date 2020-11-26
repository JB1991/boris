import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../alerts/alerts.service';
import { AlkisWfsService } from './alkis-wfs.service';

@Component({
  selector: 'power-flurstueck-search',
  templateUrl: './flurstueck-search.component.html',
  styleUrls: ['./flurstueck-search.component.scss']
})
export class FlurstueckSearchComponent implements OnInit {

  private gemarkung = '5328';
  private flur = '003';
  private zaehler = '00079';
  private nenner = '0001';

  constructor(public alkisWfsService: AlkisWfsService,
    public alerts: AlertsService
  ) { }

  ngOnInit(): void {
  }

  public getFlurstueck() {
    this.alkisWfsService.getFlurstueckByFsk(this.gemarkung, this.flur, this.zaehler, this.nenner)
      .subscribe(
        res => this.alkisWfsService.updateFeatures(res),
        err => {
          console.log(err);
          this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
        }
      );
  }

}
