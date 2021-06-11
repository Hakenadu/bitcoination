import {Component, Input, OnInit} from '@angular/core';
import {Nation} from '../services/nations.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  templateUrl: './purchases.component.html'
})
export class PurchasesComponent {

  @Input()
  public nation?: Nation;

  constructor(public matDialogRef: MatDialogRef<PurchasesComponent>) {
  }
}
