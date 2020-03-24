import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppNameService} from '@app/app-name.service';
import {GeosearchService} from '@app/shared/geosearch/geosearch.service';
import {Feature} from 'geojson';
import {Subscription} from 'rxjs';
import {NgbAccordion} from '@ng-bootstrap/ng-bootstrap';
import {BodenrichtwertService} from '@app/bodenrichtwert/bodenrichtwert.service';

export const STICHTAGE = [
  '2019-12-31',
  '2018-12-31', '2017-12-31', '2016-12-31', '2015-12-31',
  '2014-12-31', '2013-12-31', '2012-12-31', '2011-12-31'
];

export const TEILMAERKTE = [
  {value: 'B', viewValue: 'Bauland'},
  {value: 'LF', viewValue: 'Landwirtschaft'},
  {value: 'SF', viewValue: 'Sonderfläche'},
  {value: 'R', viewValue: 'R'},
  {value: 'E', viewValue: 'E'},
];

@Component({
  selector: 'power-main',
  template: `
    <div class="wrapper">

      <div class="height-minus-header-map" #map [class.small]="features">
        <a class="anchor"></a>
        <power-bodenrichtwertkarte [(stichtag)]="stichtag" [(teilmarkt)]="teilmarkt"></power-bodenrichtwertkarte>
      </div>

        <ngb-accordion #acc="ngbAccordion" style="background-color: white !important; border-bottom: 0px; !important;">
          <ngb-panel style="border: 0px !important;">
            <ng-template ngbPanelHeader>
              <div>
                <div *ngIf="!adresse" class="text-center">
                  <h5 class="m-0 mx-center">Wählen Sie eine Position auf der Karte</h5>
                </div>
                <div *ngIf="adresse" class="text-center">
                  <h5 class="m-0 mx-center">{{adresse.properties.text}}
                    <button (click)="map.classList.toggle('small')" class="btn btn-link p-0">
                      <img src="/assets/icons/chevron-down.svg" width="25" height="25">
                    </button>
                  </h5>

                </div>
              </div>
            </ng-template>
            <ng-template ngbPanelContent>
              <power-bodenrichtwert-liste [stichtag]="stichtag" [teilmarkt]="teilmarkt" [features]="features"></power-bodenrichtwert-liste>
            </ng-template>
          </ngb-panel>
        </ngb-accordion>

      <!--<div class="height-minus-header bg-light">-->
      <!--  <a class="anchor" #details></a>-->
      <!--    <power-bodenrichtwert-detail></power-bodenrichtwert-detail>-->
      <!--</div>-->
      <div class="height-minus-header row m-1" *ngIf="features">
        <a class="anchor" #verlauf></a>
        <power-bodenrichtwert-verlauf class="col-md-12" [features]="features"></power-bodenrichtwert-verlauf>
      </div>
    </div>


  `,
  styles: [`
    power-bodenrichtwertkarte {
      flex-grow: 1;
    }

    .height-minus-header {
      min-height: calc(100vh - 56px);
    }

    .height-minus-header-map {
      height: calc(100vh - 106px);
      -moz-transition: height .6s ease;
      -webkit-transition: height .6s ease;
      -o-transition: height .6s ease;
      transition: height .6s ease;
    }

    .small {
      height: 50vh;
      -moz-transition: height .6s ease;
      -webkit-transition: height .6s ease;
      -o-transition: height .6s ease;
      transition: height .6s ease;
    }

    .anchor {
      position: relative;
      top: -100px;
    }

    .nav-scroller {
      position: fixed;
      width: 100%;
      z-index: 1000;
      height: 2.75rem;
      overflow-y: hidden;
    }

    .nav-scroller .nav {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: nowrap;
      flex-wrap: nowrap;
      padding-bottom: 1rem;
      margin-top: -1px;
      overflow-x: auto;
      color: rgba(255, 255, 255, .75);
      text-align: center;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }

    .nav-underline .nav-link {
      padding-top: .75rem;
      padding-bottom: .75rem;
      font-size: .875rem;
      color: #6c757d;
    }

    .nav-underline .nav-link:hover {
      color: #007bff;
    }

    .nav-underline .active {
      font-weight: 500;
      color: #343a40;
    }

    ngb-accordion /deep/ .card /deep/ .card-header {
      background-color: white !important;
    }
  `]
})
export class BodenrichtwertComponent implements OnInit, OnDestroy {

  adresse: Feature;
  adresseSubscription: Subscription;

  features;
  featureSubscription: Subscription;

  stichtag;
  teilmarkt;

  @ViewChild('acc', {static: true}) acc: NgbAccordion;

  constructor(private appNameService: AppNameService, private geosearchService: GeosearchService, private bodenrichtwertService: BodenrichtwertService) {
    this.adresseSubscription = this.geosearchService.getFeatures().subscribe(adr => this.adresse = adr);
    this.featureSubscription = this.bodenrichtwertService.getFeatures().subscribe(ft => {
      this.acc.expandAll();
      this.features = ft;
    });
    this.stichtag = STICHTAGE[0];
    this.teilmarkt = TEILMAERKTE[0];
  }

  ngOnInit() {
    this.appNameService.updateName('BORIS');
  }

  ngOnDestroy(): void {
    this.appNameService.updateName(null);
    this.adresseSubscription.unsubscribe();
  }


}
