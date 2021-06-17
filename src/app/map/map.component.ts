import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Nation} from './services/nations.service';
import {PopupComponent} from './popup/popup.component';
import {MapChartComponent} from './chart/map-chart.component';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'btc-map',
  templateUrl: './map.component.html',
  styleUrls: ['map.component.scss'],
  animations: [
    trigger(
      'zoomFadeIn',
      [
        transition(
          ':enter', [
            style({transform: 'scale(0)', opacity: 0}),
            animate('0.3s', style({opacity: 1, transform: 'scale(1)'})),
          ]
        ),
        transition(
          ':leave', [
            style({opacity: 1, transform: 'scale(1)'}),
            animate('0.3s', style({opacity: 0, transform: 'scale(0)'})),
          ]
        ),
      ])
  ]
})
export class MapComponent {

  @ViewChild(MapChartComponent)
  mapChart?: MapChartComponent;

  constructor(private matDialog: MatDialog) {
  }

  showPurchases(nation: Nation, zoomToNation: boolean): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(PopupComponent, dialogConfig);
    dialogRef.componentInstance.nation = nation;

    if (zoomToNation) {
      this.mapChart?.zoomToNation(nation);
    }
  }
}
