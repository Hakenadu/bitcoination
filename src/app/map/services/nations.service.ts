import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

export interface Purchase {
  id: number;
  buy_date: Date;
  amount: number;
}

export interface CountryCode {
  id: number;
  name: string;
  code: string;
}

export interface Nation {
  id: number;
  country_code: CountryCode;
  status: 'legal' | 'not_legal';
  purchases?: Purchase[];
}

@Injectable({
  providedIn: 'root'
})
export class NationsService {

  private _nations = new BehaviorSubject<Nation[] | null>(null);

  constructor(private httpClient: HttpClient) {
    this.httpClient.get<Nation[]>(`${environment.strapiBaseUrl}/nations`).subscribe(nations => {
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
    return this.nations.pipe(map(nations => nations.find(n => n.country_code.code === countryCode)));
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
