import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Description {
  id: number;
  description: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})

export class DescriptionService {

  private _description = new BehaviorSubject<string | null>(null);


  constructor(private httpClient: HttpClient) {
    this.httpClient.get<Description>(`${environment.strapiBaseUrl}/description`,).subscribe(description => {
      this._description.next(description.description);
    });
  }

  get description(): Observable<string> {
    console.log(this._description.value);
    if (!this._description.value) {
      return this._description.asObservable().pipe(map(description => !description ? '' : description));
    }
    return of(this._description.value);
  }
}
