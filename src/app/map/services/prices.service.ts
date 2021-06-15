import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

export interface Coin {
  id: number;
  symbol: string;
  market_data: {
    current_price: {
      usd: number;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PricesService {

  bitcoinPrice = new BehaviorSubject<number | null>(null);

  constructor(private httpClient: HttpClient) {
    this.httpClient.get<Coin>(`https://api.coingecko.com/api/v3/coins/bitcoin`, {
      params: new HttpParams()
        .set('localization', 'false')
        .set('tickers', 'false')
        .set('market_data', 'true')
        .set('community_data', 'false')
        .set('developer_data', 'false')
        .set('sparkline', 'false')
    }).subscribe(coin => {
      this.bitcoinPrice.next(coin.market_data.current_price.usd);
    });
  }
}
