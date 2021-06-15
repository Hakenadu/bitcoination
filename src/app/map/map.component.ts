import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Nation} from './services/nations.service';
import {PurchasesComponent} from './purchases/purchases.component';
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

  private _showResetMapButton = false;

  constructor(private matDialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  showPurchases(nation: Nation, zoomToNation: boolean): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(PurchasesComponent, dialogConfig);
    dialogRef.componentInstance.nation = nation;

    if (zoomToNation) {
      this.mapChart?.zoomToNation(nation);
    }
  }

  get showResetMapButton(): boolean {
    return this._showResetMapButton;
  }

  set showResetMapButton(showResetMapButton: boolean) {
    if (this._showResetMapButton !== showResetMapButton) {
      this._showResetMapButton = showResetMapButton;
      this.changeDetectorRef.detectChanges();
    }
  }
}
