import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Holding, Nation} from '../services/nations.service';
import {MatDialogRef} from '@angular/material/dialog';
import {PricesService} from '../services/prices.service';
import {CurrencyPipe, DecimalPipe} from '@angular/common';
import {MarkdownService} from 'ngx-markdown';


const NOT_AVAILABLE_PLACEHOLDER = 'N/A';

@Component({
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  providers: [
    CurrencyPipe,
    DecimalPipe
  ]
})
export class PopupComponent {


  @Input()
  public nation?: Nation;
  displayedColumns: string[] = ['cost_basis', 'amount', 'current-value', 'change'];

  constructor(public matDialogRef: MatDialogRef<PopupComponent>,
              private pricesService: PricesService,
              private currencyPipe: CurrencyPipe,
              private decimalPipe: DecimalPipe,
              public markdownService: MarkdownService
  ) {

    this.markdownService.renderer.link = (href: string, title: string, text: string) => {
      const escapedText = text?.toLowerCase().replace(/[^\w]+/g, '-');
      const escapedHref = href?.toLowerCase().replace(/[^\w]+/g, '-');
      return '<a href="' + href + '" target="_blank">  ' + text + '</a> ';
    };

  }

  currentValueDisplayString(holding: Holding): string {
    return this.formatValue(this.currentValue(holding), input => this.currencyPipe.transform(input));
  }

  private formatValue(value: number | undefined | null, transform: (input: string) => string | null): string {
    if (value === undefined || value === null) {
      return NOT_AVAILABLE_PLACEHOLDER;
    }
    const formatted = transform(value.toString());
    if (formatted === null) {
      throw new Error('no value after formatting');
    }
    return formatted;
  }

  currentValue(holding: Holding): number | undefined {
    const bitcoinPrice = this.pricesService.bitcoinPrice.value;
    if (bitcoinPrice !== null) {
      return holding.amount * bitcoinPrice;
    }
    return undefined;
  }

  amountDisplayString(holding: Holding): string {
    return this.formatValue(holding.amount, input => this.currencyPipe.transform(input, '\u20bf'));
  }

  costBasisDisplayString(holding: Holding): string {
    return this.formatValue(holding.cost_basis, input => this.currencyPipe.transform(input));
  }

  change(holding: Holding): number | undefined {
    const costBasis = holding.cost_basis;
    const currentValue = this.currentValue(holding);
    if (costBasis === undefined || costBasis === null || currentValue === undefined || costBasis === 0) {
      return undefined;
    }
    return (currentValue / costBasis) * 100;
  }

  changeClass(holding: Holding): { [klass: string]: any } {
    const change = this.change(holding);
    return {
      'text-success': change !== undefined && change > 0,
      'text-danger': change !== undefined && change < 0
    };
  }

  changePositive(holding: Holding): boolean {
    const change = this.change(holding);
    return change !== undefined && change > 0;
  }

  changeNegative(holding: Holding): boolean {
    const change = this.change(holding);
    return change !== undefined && change < 0;
  }

  changeDisplayString(holding: Holding): string {
    return this.formatValue(this.change(holding), input => `${this.decimalPipe.transform(input, '4.1-5')}%`);
  }
}
