import {AfterViewInit, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';

@Component({
  selector: 'btc-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.scss']
})
export class MapChartComponent implements AfterViewInit {

  @ViewChild('chartDiv')
  private chartDiv: ElementRef<HTMLDivElement> | undefined;


  constructor(@Inject(PLATFORM_ID) private platformId: any, private zone: NgZone) {
  }

  browserOnly(f: () => void): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit(): void {
    this.browserOnly(() => {
      am4core.useTheme((target) => {
        if (target instanceof am4core.ColorSet) {
          target.list = [
            am4core.color('gray')
          ];
        }
      });
      am4core.useTheme(am4themes_animated);

      const chart = am4core.create(this.chartDiv?.nativeElement, am4maps.MapChart);

      chart.geodata = am4geodata_worldLow;

      chart.projection = new am4maps.projections.Miller();

      const worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
      worldSeries.exclude = ['AQ'];
      worldSeries.useGeodata = true;

      const polygonTemplate = worldSeries.mapPolygons.template;
      polygonTemplate.tooltipText = '{name}';
      polygonTemplate.fill = chart.colors.getIndex(0);
      polygonTemplate.nonScalingStroke = true;

      const hs = polygonTemplate.states.create('hover');
      hs.properties.fill = am4core.color('#367B25');

      chart.events.on('ready', (ev) => {
        worldSeries.getPolygonById('SV').fill = am4core.color('#FF9900');
      });
    });
  }
}
