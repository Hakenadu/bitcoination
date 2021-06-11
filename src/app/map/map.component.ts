import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Nation} from './services/nations.service';
import {PurchasesComponent} from './purchases/purchases.component';
import {MapChartComponent} from './chart/map-chart.component';

@Component({
  selector: 'btc-map',
  templateUrl: './map.component.html'
})
export class MapComponent {

  @ViewChild(MapChartComponent)
  mapChart?: MapChartComponent;

  constructor(private matDialog: MatDialog) {
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
}
