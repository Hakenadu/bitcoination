import {Component, ViewChild} from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {MatomoTracker} from 'ngx-matomo';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {slideInAnimation} from './shared/animations';

@Component({
  selector: 'btc-root',
  templateUrl: './app.component.html',
  animations: [slideInAnimation]
})
export class AppComponent {

  @ViewChild(NavbarComponent)
  navbar: NavbarComponent | undefined;

  constructor(private router: Router,
              activatedRoute: ActivatedRoute,
              matomoTracker: MatomoTracker) {
    router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => activatedRoute),
        map(route => route.firstChild),
        switchMap(route => route?.data ? route.data : of(null))
      ).subscribe(data => {
      if (!data) {
        return;
      }
      if (data.name) {
        matomoTracker.trackEvent('show-page', data.name);
      }
    });
  }

  startAnimation($event: any) {
    document.body.classList.add('overflow-hidden');
  }

  endAnimation($event: any) {
    document.body.classList.remove('overflow-hidden');
  }

  prepareRoute(outlet: RouterOutlet) {
    // tslint:disable-next-line:no-string-literal
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['name'];
  }
}
