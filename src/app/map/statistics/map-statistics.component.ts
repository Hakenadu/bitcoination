import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Nation, NationsService} from '../services/nations.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';

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

  loadNations(pageIndex: number, pageSize: number): void {
    this.loadingSubject.next(true);

    this.nationsService.findNations(pageIndex, pageSize)
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
export class MapStatisticsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator)
  private matPaginator?: MatPaginator;

  dataSource: NationsDataSource;
  displayedColumns = ['name', 'status'];

  collapsed = false;

  defaultPageSize = 5;
  nationsCount?: number;

  constructor(private nationsService: NationsService) {
    this.dataSource = new NationsDataSource(this.nationsService);
  }

  ngOnInit(): void {
    this.nationsService.countNations().subscribe(count => {
      this.nationsCount = count;
      this.dataSource.loadNations(0, this.defaultPageSize);
    });
  }

  ngAfterViewInit() {
    if (this.matPaginator !== undefined) {
      this.matPaginator.page.subscribe(() =>
        this.dataSource.loadNations(this.matPaginator?.pageIndex || 0, this.matPaginator?.pageSize || this.defaultPageSize));
    } else {
      throw new Error('no matPaginator after view init');
    }
  }

  toggleExpansion(): void {
    this.collapsed = !this.collapsed;
  }
}
