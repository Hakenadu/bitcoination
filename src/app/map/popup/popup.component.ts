import {Component, Input, OnInit} from '@angular/core';
import {Nation} from '../services/nations.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NationsDataSource} from '../statistics/map-statistics.component';


@Component({
  templateUrl: './popup.component.html'
})
export class PopupComponent {

  @Input()
  public nation?: Nation;

  constructor(public matDialogRef: MatDialogRef<PopupComponent>) {
  }

  displayedColumns: string[] = ['cost_basis', 'amount'];

}
