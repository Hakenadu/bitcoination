import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';

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

  constructor(private httpClient: HttpClient) {
  }

  findNations(pageIndex: number, pageSize: number): Observable<Nation[]> {
    const start = pageIndex * pageSize;
    return this.httpClient.get<Nation[]>(`${environment.strapiBaseUrl}/nations`, {
      params: new HttpParams().set('_start', start.toString()).set('_limit', pageSize.toString())
    });
  }

  countNations(): Observable<number> {
    return this.httpClient.get<number>(`${environment.strapiBaseUrl}/nations/count`);
  }
}
