import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {EChartOption} from 'echarts';
import {BodenrichtwertService} from '../bodenrichtwert.service';
import {Feature, FeatureCollection} from 'geojson';

@Component({
  selector: 'power-bodenrichtwert-verlauf',
  templateUrl: './bodenrichtwert-verlauf.component.html',
  styleUrls: ['./bodenrichtwert-verlauf.component.scss']
})
export class BodenrichtwertVerlaufComponent implements OnChanges {

  state: any;


  chartOption: EChartOption = {
    title: {
      text: 'Step Line'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Step Start', 'Step Middle', 'Step End']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
    },
    yAxis: {
      type: 'value'
    },
    series: []
  };

  @Input() adresse: Feature;

  @Input() features: FeatureCollection;

  lat: any;
  lng: any;

  echartsIntance;

  constructor(private bodenrichtwertService: BodenrichtwertService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.features) {
      this.load();
    }
  }

  load() {
    // Gruppieren nach WNUM
    const grouped = this.groupBy(this.features.features, item => item.properties.wnum);

    const result: Map<string, []> = new Map<string, []>();
    for (const key of grouped.keys()) {
      result.set(key, []);
    }

    this.chartOption.series = [];
    this.chartOption.legend = {data: []};

    for (const [key, value] of grouped.entries()) {

      const x = [
        {stag: '2012', brw: 0, nutzung: ''},
        {stag: '2013', brw: 0, nutzung: ''},
        {stag: '2014', brw: 0, nutzung: ''},
        {stag: '2015', brw: 0, nutzung: ''},
        {stag: '2016', brw: 0, nutzung: ''},
        {stag: '2017', brw: 0, nutzung: ''},
        {stag: '2018', brw: 0, nutzung: ''},
        {stag: '2019', brw: 0, nutzung: ''},
      ];

      const t = value
        // Stichtage < 2011 löschen
        .filter(brw => {
          return new Date(brw.properties.stag) > new Date('2011-12-31');
        })
        // Ausschließlich STAG und BRW zurückgeben
        .map(brw => {
          return {stag: brw.properties.stag.substring(0, 4), brw: brw.properties.brw, nutzung: brw.properties.ergaenzung};
        });

      const hash = Object.create(null);
      x.forEach(obj => hash[obj.stag] = obj);
      t.forEach(obj => Object.assign(hash[obj.stag], obj));

        // Sortieren nach Stichtagen
        x.sort((a, b) => {
          const dateA = new Date(a.stag).getTime();
          const dateB = new Date(b.stag).getTime();
          if (dateA < dateB) {
            return -1;
          } else if (dateA > dateB) {
            return 1;
          } else {
            return 0;
          }
        });

      console.log(x);

      // TODO Aktuelles Jahr zusätzlich anzeigen mit letztem STAG

      this.chartOption.legend.data.push(key);

      this.chartOption.series.push({
          name: key,
          type: 'line',
          step: 'end',
          data: x.map(brw => brw.brw)
        }
      );

    }
    this.echartsIntance.setOption(Object.assign(this.chartOption, this.chartOption), true, true);

  }

  groupBy(list, keyGetter) {
    const m = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = m.get(key);
      if (!collection) {
        m.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return m;
  }

  uniqBy(a, key) {
    const seen = {};
    return a.filter(function(item) {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  downloadGeoJSON() {

  }
}
