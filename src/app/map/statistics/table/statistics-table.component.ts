import {Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NationsDataSource} from '../map-statistics.component';
import {Holding, Nation} from '../../services/nations.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {CurrencyPipe, DecimalPipe} from '@angular/common';
import {PricesService} from '../../services/prices.service';

const NOT_AVAILABLE_PLACEHOLDER = 'N/A';

@Component({
  selector: 'btc-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss'],
  providers: [
    CurrencyPipe,
    DecimalPipe
  ]
})
export class StatisticsTableComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  holdingsTooltip = 'Official government or central bank holdings such as treasury reserves or publicly disclosed mining profits';

  @HostBinding('class')
  hostClass = 'btc-statistics-table';

  @Input()
  dataSource?: NationsDataSource;

  @Output()
  nationSelected = new EventEmitter<Nation>();

  @ViewChild(MatPaginator)
  private matPaginator?: MatPaginator;
  private _tabbed = false;

  constructor(private pricesService: PricesService,
              private breakpointObserver: BreakpointObserver,
              private currencyPipe: CurrencyPipe,
              private decimalPipe: DecimalPipe) {
  }

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).pipe(takeUntil(this.destroyed)).subscribe(state => {
      if (state.breakpoints[Breakpoints.XSmall] || state.breakpoints[Breakpoints.Small]) {
        this.tabbed = true;
      } else {
        this.tabbed = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  costBasis(nation: Nation): number | undefined {
    return this.holdingValueSum(nation, holding => holding.cost_basis);
  }

  costBasisDisplayString(nation: Nation): string {
    return this.formatValue(this.costBasis(nation), input => this.currencyPipe.transform(input));
  }

  amount(nation: Nation): number | undefined {
    return this.holdingValueSum(nation, holding => holding.amount);
  }

  amountDisplayString(nation: Nation): string {
    return this.formatValue(this.amount(nation), input => this.currencyPipe.transform(input, '\u20bf'));
  }

  currentValue(nation: Nation): number | undefined {
    const bitcoinPrice = this.pricesService.bitcoinPrice.value;
    if (bitcoinPrice !== null) {
      return this.holdingValueSum(nation, holding => holding.amount * bitcoinPrice);
    }
    return undefined;
  }

  currentValueDisplayString(nation: Nation): string {
    return this.formatValue(this.currentValue(nation), input => this.currencyPipe.transform(input));
  }

  change(nation: Nation): number | undefined {
    const costBasis = this.costBasis(nation);
    const currentValue = this.currentValue(nation);
    if (costBasis === undefined || currentValue === undefined) {
      return undefined;
    }
    return (currentValue / costBasis) * 100;
  }

  changePositive(nation: Nation): boolean {
    const change = this.change(nation);
    return change !== undefined && change > 0;
  }

  changeNegative(nation: Nation): boolean {
    const change = this.change(nation);
    return change !== undefined && change < 0;
  }

  changeClass(nation: Nation): { [klass: string]: any } {
    const change = this.change(nation);
    return {
      'text-success': change !== undefined && change > 0,
      'text-danger': change !== undefined && change < 0
    };
  }

  changeDisplayString(nation: Nation): string {
    return this.formatValue(this.change(nation), input => `${this.decimalPipe.transform(input, '4.1-5')}%`);
  }

  private formatValue(value: number | undefined, transform: (input: string) => string | null): string {
    if (value === undefined) {
      return NOT_AVAILABLE_PLACEHOLDER;
    }
    const formatted = transform(value.toString());
    if (formatted === null) {
      throw new Error('no value after formatting');
    }
    return formatted;
  }

  private holdingValueSum(nation: Nation, valueRetriever: (holding: Holding) => number): number | undefined {
    if (!nation.holdings || nation.holdings.length === 0) {
      return undefined;
    }
    return nation.holdings.map(valueRetriever)
      .reduce((sum, current) => sum + current, 0);
  }

  set tabbed(tabbed: boolean) {
    if (this._tabbed !== tabbed) {
      this._tabbed = tabbed;
    }
  }

  get tabbed(): boolean {
    return this._tabbed;
  }
}
