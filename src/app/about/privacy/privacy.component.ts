import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'btc-privacy',
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent implements OnInit {
  optedIn = new FormControl(null);

  ngOnInit() {
    this.updateOptOut();
    this.optedIn.valueChanges.subscribe(value => {
      if (value) {
        // @ts-ignore
        _paq.push(['forgetUserOptOut']);
      } else {
        // @ts-ignore
        _paq.push(['optUserOut']);
      }
    });
  }

  private updateOptOut() {
    const formControl = this.optedIn;
    // @ts-ignore
    _paq.push([function () {
      // @ts-ignore
      formControl.setValue(!this.isUserOptedOut());
    }]);
  }

  get optOutCheckboxText(): string {
    if (!this.optedIn.value) {
      return 'You are currently opted out. Check this box to opt-in.';
    }
    return 'You are not opted out. Uncheck this box to opt-out.';
  }
}

