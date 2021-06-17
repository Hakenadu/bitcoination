import {Component, Input} from '@angular/core';
import {Nation} from '../services/nations.service';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

  @Input()
  public nation?: Nation;
  displayedColumns: string[] = ['cost_basis', 'amount'];

  constructor(public matDialogRef: MatDialogRef<PopupComponent>) {
  }

}
