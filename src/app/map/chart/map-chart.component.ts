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
import {BaseObject, MouseCursorStyle} from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4maps from '@amcharts/amcharts4/maps';
import {MapChart, MapPolygon} from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import {Nation, NationsService} from '../services/nations.service';
import {map} from 'rxjs/operators';
import {ConfigService} from '../../services/config.service';

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
              private nationsService: NationsService,
              private configService: ConfigService) {
    this.configService.showMinimap$.subscribe(showMinimap => {
      if (!this.chart) {
        return;
      }
      this.chart.smallMap.disabled = !showMinimap;
    });
    this.configService.darkmode$.subscribe(darkmode => {
      if (!this.chart) {
        return;
      }
      // recreate chart
      this.ngAfterViewInit();
    });
  }

  browserOnly(f: () => void): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  private customTheme(target: BaseObject): void {
    if (target instanceof am4core.ColorSet) {
      if (this.configService.darkmode) {
        target.list = [
          am4core.color('#939393')
        ];
      } else {
        target.list = [
          am4core.color('#BCBCBC')
        ];
      }
    }
  }

  ngAfterViewInit(): void {
    this.browserOnly(() => {
      am4core.useTheme(this.customTheme.bind(this));
      am4core.useTheme(am4themes_animated);

      this.chart = am4core.create(this.chartDiv?.nativeElement, am4maps.MapChart);
      this.chart.geodata = am4geodata_worldLow;
      this.chart.projection = new am4maps.projections.Miller();

      this.worldSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
      this.worldSeries.exclude = ['AQ'];
      this.worldSeries.useGeodata = true;

      this.chart.chartContainer.wheelable = false;
      this.chart.chartContainer.cursorDownStyle = MouseCursorStyle.grabbing;

      const polygonTemplate = this.worldSeries.mapPolygons.template;
      polygonTemplate.applyOnClones = true;
      polygonTemplate.togglable = true;
      polygonTemplate.tooltipText = '{name}';
      polygonTemplate.fill = this.chart.colors.getIndex(0);
      polygonTemplate.stroke = am4core.color(this.configService.darkmode ? 'rgb(66,66,66)' : 'rgb(255,255,255)');
      polygonTemplate.nonScalingStroke = true;

      this.chart.smallMap = new am4maps.SmallMap();
      this.chart.smallMap.align = 'left';
      this.chart.smallMap.valign = 'top';
      this.chart.smallMap.marginTop = 14;
      this.chart.smallMap.disabled = !this.configService.showMinimap;
      this.chart.smallMap.stroke = am4core.color('gray');
      this.chart.smallMap.series.push(this.worldSeries);

      this.chart.zoomControl = new am4maps.ZoomControl();

      this.chart.zoomControl.plusButton.tooltipText = 'Zoom in';
      this.setButtonIconPath(this.chart.zoomControl.plusButton, 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z');
      this.setButtonStyle(this.chart.zoomControl.plusButton);

      this.chart.zoomControl.minusButton.tooltipText = 'Zoom out';
      this.setButtonIconPath(this.chart.zoomControl.minusButton, 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z');
      this.setButtonStyle(this.chart.zoomControl.minusButton);

      this.addToggleSmallMapButton(this.chart);
      this.addHomeButton(this.chart);

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

  private addHomeButton(chart: am4maps.MapChart): void {
    const homeButton = new am4core.Button();
    homeButton.events.on('hit', () => this.chart?.goHome());
    this.setButtonIconPath(homeButton, 'M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z');
    homeButton.width = 30;
    homeButton.marginBottom = 3;
    homeButton.parent = chart.zoomControl;
    homeButton.tooltipText = 'Reset zoom';
    this.setButtonStyle(homeButton);
    homeButton.insertBefore(chart.zoomControl.plusButton);
  }

  private addToggleSmallMapButton(chart: am4maps.MapChart): void {
    const toggleSmallMapButton = new am4core.Button();
    toggleSmallMapButton.events.on('hit', () => this.configService.showMinimap = !this.configService.showMinimap);
    this.setButtonIconPath(toggleSmallMapButton, 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z');
    toggleSmallMapButton.width = 30;
    toggleSmallMapButton.marginBottom = 3;
    toggleSmallMapButton.parent = chart.zoomControl;
    toggleSmallMapButton.tooltipText = 'Toggle minimap';
    this.setButtonStyle(toggleSmallMapButton);
    toggleSmallMapButton.insertBefore(chart.zoomControl.plusButton);
  }

  private setButtonStyle(button: am4core.Button): void {
    if (this.configService.darkmode) {
      button.background.fill = am4core.color('#424242');
      button.fill = am4core.color('#FFFFFF');
    } else {
      button.background.fill = am4core.color('#BCBCBC');
      button.fill = am4core.color('#000000');
    }
    button.stroke = button.background.fill;
  }

  private setButtonIconPath(button: am4core.Button, path: string): void {
    button.padding(7, 5, 7, 5);
    button.label = undefined;
    button.icon = new am4core.Sprite();
    button.icon.path = path;
  }
}
