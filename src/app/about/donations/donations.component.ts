import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'btc-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent {
  donateId = '3ENEWZMuBV3nqMrAebZpMoZhjmvCJt7ogV';

  constructor(private matSnackbar: MatSnackBar) {
  }

  showClipboardCopyText(): void {
    this.matSnackbar.open('copied to clipboard', 'OK', {
      horizontalPosition: 'end',
      duration: 2000
    });
  }
}
