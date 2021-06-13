import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

export interface Holding {
  id: number;
  buy_date: Date;
  amount: number;
}

export interface Nation {
  id: number;
  status: 'legal' | 'not_legal';
  holdings?: Holding[];
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class NationsService {

  private _nations = new BehaviorSubject<Nation[] | null>(null);

  constructor(private httpClient: HttpClient) {
    this.httpClient.get<Nation[]>(`${environment.strapiBaseUrl}/nations`, {
      params: new HttpParams().set('status', 'legal')
    }).subscribe(nations => {
      this._nations.next(nations);
    });
  }

  get nations(): Observable<Nation[]> {
    if (!this._nations.value) {
      return this._nations.asObservable().pipe(map(nations => !nations ? [] : nations));
    }
    return of(this._nations.value);
  }

  findNationByCountryCode(countryCode: string): Observable<Nation | undefined> {
    return this.nations.pipe(map(nations => nations.find(n => n.code === countryCode)));
  }

  findNations(pageIndex: number, pageSize: number): Observable<Nation[]> {
    const start = pageIndex * pageSize;
    return this.nations.pipe(
      map(nations => {
        return nations.slice(start, start + pageSize);
      })
    );
  }

  countNations(): Observable<number> {
    return this.nations.pipe(map(nations => !nations ? 0 : nations.length));
  }
}
