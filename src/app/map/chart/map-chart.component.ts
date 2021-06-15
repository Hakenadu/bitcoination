import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  Output,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4maps from '@amcharts/amcharts4/maps';
import {MapChart, MapPolygon} from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import {Nation, NationsService} from '../services/nations.service';
import {map} from 'rxjs/operators';
import {Percent} from '@amcharts/amcharts4/core';

@Component({
  selector: 'btc-map-chart',
  templateUrl: './map-chart.component.html'
})
export class MapChartComponent implements AfterViewInit {

  @ViewChild('chartDiv')
  private chartDiv: ElementRef<HTMLDivElement> | undefined;

  @Output()
  nationSelected = new EventEmitter<Nation>();

  @Output()
  positionModified = new EventEmitter<boolean>();

  private chart?: MapChart;
  private worldSeries?: am4maps.MapPolygonSeries;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private zone: NgZone,
              private nationsService: NationsService) {
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
            am4core.color('#BCBCBC')
          ];
        }
      });
      am4core.useTheme(am4themes_animated);

      this.chart = am4core.create(this.chartDiv?.nativeElement, am4maps.MapChart);
      this.chart.zoomDuration = 200;
      this.chart.zoomEasing = am4core.ease.cubicInOut;
      this.chart.zoomStep = 5;
      this.chart.events.on('drag', ev => {
        this.positionModified.emit(true);
      });
      this.chart.events.on('zoomlevelchanged', ev => {
        this.positionModified.emit(this.chart?.zoomLevel !== 1);
      });

      this.chart.geodata = am4geodata_worldLow;

      this.chart.projection = new am4maps.projections.Miller();

      this.worldSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
      this.worldSeries.exclude = ['AQ'];
      this.worldSeries.useGeodata = true;

      const polygonTemplate = this.worldSeries.mapPolygons.template;
      polygonTemplate.tooltipText = '{name}';
      polygonTemplate.fill = this.chart.colors.getIndex(0);
      polygonTemplate.nonScalingStroke = true;

      const hs = polygonTemplate.states.create('hover');
      hs.properties.fill = am4core.color('#888888');

      polygonTemplate.events.on('hit', ev => this.onPolygonClicked(ev.target));

      this.chart.events.on('ready', ev => this.onChartReady());
    });
  }

  private onPolygonClicked(polygon: MapPolygon): void {
    // zoom to an object
    polygon.series.chart.zoomToMapObject(polygon);

    const countryCode = (polygon.dataItem?.dataContext as { id: string }).id;

    this.zone.run(() => {
      this.nationsService.findNationByCountryCode(countryCode).subscribe(clickedNation => {
        if (clickedNation) {
          this.nationSelected.emit(clickedNation);
        }
      });
    });
  }

  private onChartReady(): void {
    this.nationsService.nations.pipe(map(nations =>
      nations.filter(nation => nation.status === 'legal')
        .map(nation => nation.code)
        .map(code => {
          if (!this.worldSeries) {
            throw new Error('worldSeries missing');
          }
          return this.worldSeries.getPolygonById(code);
        })))
      .subscribe(polygons => {
        if (polygons.length === 0) {
          return;
        }
        for (const polygon of polygons) {
          polygon.fill = am4core.color('#FF9900');
        }
      });
  }

  zoomToNation(nation: Nation): void {
    const nationPolygon = this.worldSeries?.getPolygonById(nation.code);
    if (!nationPolygon) {
      return;
    }
    this.chart?.zoomToMapObject(nationPolygon);
  }

  zoomOut(): void {
    this.chart?.goHome();
    this.positionModified.emit(false);
  }
}
