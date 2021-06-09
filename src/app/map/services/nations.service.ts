import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

export interface Nation {
  name: string;
  code: string;
  status: 'legal' | 'not_legal';
}

@Injectable({
  providedIn: 'root'
})
export class NationsService {

  private nations: Nation[] = [
    {name: 'Germany', code: 'XX', status: 'not_legal'},
    {name: 'El Salvador', code: 'SV', status: 'legal'},
    {name: 'Puddingland', code: 'XX', status: 'not_legal'},
    {name: 'Austria', code: 'XX', status: 'not_legal'},
    {name: 'Australia', code: 'XX', status: 'not_legal'},
    {name: 'Ireland', code: 'XX', status: 'not_legal'},
  ];

  constructor(private httpClient: HttpClient) {
  }

  findNations(): Observable<Nation[]> {
    return of(this.nations);
  }
}
