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
      this.chart.geodata = am4geodata_worldLow;
      this.chart.projection = new am4maps.projections.Miller();

      this.worldSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
      this.worldSeries.exclude = ['AQ'];
      this.worldSeries.useGeodata = true;
      this.chart.chartContainer.wheelable = false;

      const polygonTemplate = this.worldSeries.mapPolygons.template;
      polygonTemplate.applyOnClones = true;
      polygonTemplate.togglable = true;
      polygonTemplate.tooltipText = '{name}';
      polygonTemplate.fill = this.chart.colors.getIndex(0);
      polygonTemplate.nonScalingStroke = true;

      this.chart.smallMap = new am4maps.SmallMap();
      this.chart.smallMap.align = 'left';
      this.chart.smallMap.valign = 'top';
      this.chart.smallMap.marginTop = 14;
      this.chart.smallMap.stroke = am4core.color('gray');
      this.chart.smallMap.series.push(this.worldSeries);

      this.chart.zoomControl = new am4maps.ZoomControl();

      let homeButton = new am4core.Button();
      homeButton.events.on("hit", () => this.chart?.goHome());

      homeButton.icon = new am4core.Sprite();
      homeButton.padding(7, 5, 7, 5);
      homeButton.width = 30;
      homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
      homeButton.marginBottom = 10;
      homeButton.parent = this.chart.zoomControl;
      homeButton.insertBefore(this.chart.zoomControl.plusButton);

      this.chart.maxPanOut = 0;
      this.chart.draggable = false;

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
}
