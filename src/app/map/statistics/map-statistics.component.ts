import {Component, OnInit} from '@angular/core';
import {Nation, NationsService} from '../services/nations.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class NationsDataSource implements DataSource<Nation> {

  private nationsSubject = new BehaviorSubject<Nation[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private nationsService: NationsService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Nation[]> {
    return this.nationsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.nationsSubject.complete();
    this.loadingSubject.complete();
  }

  loadNations(): void {
    this.loadingSubject.next(true);

    this.nationsService.findNations()
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe(nations => this.nationsSubject.next(nations));
  }
}


@Component({
  selector: 'btc-map-statistics',
  templateUrl: './map-statistics.component.html',
  styleUrls: ['./map-statistics.component.scss']
})
export class MapStatisticsComponent implements OnInit {

  dataSource: NationsDataSource;
  displayedColumns = ['name', 'status'];

  collapsed = false;

  constructor(private nationsService: NationsService) {
    this.dataSource = new NationsDataSource(this.nationsService);
  }

  ngOnInit(): void {
    this.dataSource.loadNations();
  }

  toggleExpansion(): void {
    this.collapsed = !this.collapsed;
  }
}
