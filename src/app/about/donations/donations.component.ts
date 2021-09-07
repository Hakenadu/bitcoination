import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'btc-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent {
  donateBitcoin = '3PGpWj3R7tqEwrkMAafHzp7pcqBknzVvmK';
  donateLiquid = 'VJLHcBwao1dqoULYt59zrQ992N3UaVxiVZqFW6kTdq1bonrBAyDM4tr6wTJNTwweFSNBEBnsqy6z9pv5';

  constructor(private matSnackbar: MatSnackBar) {
  }

  showClipboardCopyText(title: string): void {
    this.matSnackbar.open(`copied ${title} to clipboard`, 'OK', {
      horizontalPosition: 'end',
      duration: 2000
    });
  }
}
