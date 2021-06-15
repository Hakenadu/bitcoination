import {Component, OnInit} from '@angular/core';
import {PricesService} from '../services/prices.service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'btc-price-preview',
  templateUrl: './btc-price-preview.component.html',
  styleUrls: ['./btc-price-preview.component.scss'],
  providers: [CurrencyPipe]
})
export class BtcPricePreviewComponent {

  constructor(private pricesService: PricesService,
              private currencyPipe: CurrencyPipe) {
  }

  get currentBitcoinPriceFormatted(): string | null {
    const bitcoinPrice = this.pricesService.bitcoinPrice.value;
    if (bitcoinPrice === null) {
      return null;
    }
    return this.currencyPipe.transform(bitcoinPrice.toString());
  }
}
