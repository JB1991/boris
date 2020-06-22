import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {EChartOption} from 'echarts';
import {BodenrichtwertService} from '../bodenrichtwert.service';
import {Feature, FeatureCollection} from 'geojson';
import {NutzungPipe} from "@app/bodenrichtwert/util/nutzung.pipe";

@Component({
  selector: 'power-bodenrichtwert-verlauf',
  templateUrl: './bodenrichtwert-verlauf.component.html',
  styleUrls: ['./bodenrichtwert-verlauf.component.scss']
})
export class BodenrichtwertVerlaufComponent implements OnChanges {

  state: any;

  chartOption: EChartOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: []
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
      nameLocation: 'start'
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} €/m²'
      }
    },
    series: []
  };

  @Input() adresse: Feature;

  @Input() features: FeatureCollection;

  echartsInstance;

  constructor(
    private nutzungPipe: NutzungPipe
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.features) {
      this.generate(this.features.features);
    }
  }

  generate(features) {
    // Gruppieren nach WNUM
    const grouped_by_wnum = this.groupBy(features, item => item.properties.wnum);

    this.chartOption.series = [];

    for (const [key, value] of grouped_by_wnum.entries()) {

      features = Array.from(value);

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

      for (let i = 0; i < x.length; i++) {
        const tmp = features.find(f => f.properties.stag.includes(x[i].stag));
        if (tmp) {
          x[i].brw = tmp.properties.brw;
          x[i].nutzung = this.nutzungPipe.transform(tmp.properties.nutzung, null);
        }
      }
      this.chartOption.legend.data.push(x[0].nutzung);
      this.chartOption.series.push({
              name: x[0].nutzung,
              type: 'line',
              step: 'end',
              data: x.map(t => t.brw)
            }
          );
    }
    this.echartsInstance.setOption(Object.assign(this.chartOption, this.chartOption), true, true);
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
    return a.filter(function (item) {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  downloadGeoJSON() {

  }

  onChartInit(event: any) {
    this.echartsInstance = event;
  }
}
