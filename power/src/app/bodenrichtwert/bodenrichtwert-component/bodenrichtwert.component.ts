import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GeosearchService } from '@app/shared/geosearch/geosearch.service';
import { Feature } from 'geojson';
import { Subscription } from 'rxjs';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';

/**
 * Possible selections of Stichtage
 */
export const STICHTAGE = [
  '2019-12-31',
  '2018-12-31',
  '2017-12-31',
  '2016-12-31',
  '2015-12-31',
  '2014-12-31',
  '2013-12-31',
  '2012-12-31',
  '2011-12-31'
];

/**
 * Possible selections of Teilmärkte
 */
export const TEILMAERKTE = [
  {value: 'B', viewValue: 'Bauland'},
  {value: 'LF', viewValue: 'Landwirtschaft'},
  {value: 'SF', viewValue: 'Sonderfläche'},
  {value: 'R', viewValue: 'R'},
  {value: 'E', viewValue: 'E'},
];

/**
 * Bodenrichtwert-Component arranges all Components on a single page
 */
@Component({
  selector: 'power-main',
  templateUrl: 'bodenrichtwert.component.html',
  styleUrls: ['bodenrichtwert.component.css']
})
export class BodenrichtwertComponent implements OnDestroy {

  /**
   * Adresse to be shown
   */
  adresse: Feature;

  /**
   * Subscription to adresse, loaded by Geosearch-Service
   */
  adresseSubscription: Subscription;

  /**
   * Features (Bodenrichtwerte as GeoJSON) to be shown
   */
  features;

  /**
   * Subscription to features, loaded by Bodenrichtwert-Service
   */
  featureSubscription: Subscription;

  /**
   * Actual selected Stichtag
   */
  stichtag;

  /**
   * Actual selected Teilmarkt
   */
  teilmarkt;

  /**
   * Div-ViewChild contains Bodenrichtwert-List, Bodenrichtwert-Detail and Bodenrichtwert-Verlauf
   */
  @ViewChild('acc', {static: true}) acc: NgbAccordion;

  constructor(
    private geosearchService: GeosearchService,
    private bodenrichtwertService: BodenrichtwertService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Bodenrichtwerte - POWER.NI');
    this.adresseSubscription = this.geosearchService.getFeatures().subscribe(adr => this.adresse = adr);
    this.featureSubscription = this.bodenrichtwertService.getFeatures().subscribe(ft => {
      this.acc.expandAll();
      this.features = ft;
    });
    this.stichtag = STICHTAGE[0];
    this.teilmarkt = TEILMAERKTE[0];
  }

  /**
   * Destroys all active subscriptions
   */
  ngOnDestroy(): void {
    this.adresseSubscription.unsubscribe();
    this.featureSubscription.unsubscribe();
  }
}
