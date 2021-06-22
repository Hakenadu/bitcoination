import {Component, HostBinding, ViewChild} from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {Router, RouterOutlet} from '@angular/router';
import {slideInAnimation} from './shared/animations';
import {ConfigService} from './services/config.service';
import {OverlayContainer} from '@angular/cdk/overlay';

// import {MatomoTracker} from 'ngx-matomo';

@Component({
  selector: 'btc-root',
  templateUrl: './app.component.html',
  animations: [slideInAnimation]
})
export class AppComponent {

  @ViewChild(NavbarComponent)
  navbar: NavbarComponent | undefined;

  @HostBinding('class')
  componentCssClass?: string;

  constructor(private router: Router,
              private configService: ConfigService,
              private overlayContainer: OverlayContainer
              // , activatedRoute: ActivatedRoute
              // , matomoTracker: MatomoTracker
  ) {

    this.updateTheme();
    this.configService.darkmode$.subscribe(darkmode => {
      this.updateTheme();
    });

    // router.events
    //  .pipe(
    //    filter(event => event instanceof NavigationEnd),
    //    map(() => activatedRoute),
    //    map(route => route.firstChild),
    //    switchMap(route => route?.data ? route.data : of(null))
    //  ).subscribe(data => {
    //  if (!data) {
    //    return;
    //  }
    //  if (data.name) {
    //    matomoTracker.trackEvent('show-page', data.name);
    //  }
    // });
  }


  startAnimation($event: any): void {
    document.body.classList.add('overflow-hidden');
  }

  endAnimation($event: any): void {
    document.body.classList.remove('overflow-hidden');
  }

  prepareRoute(outlet: RouterOutlet): void {
    // tslint:disable-next-line:no-string-literal
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['name'];
  }

  private updateTheme(): void {
    let classToAdd: string;
    let classToRemove: string;

    if (this.configService.darkmode) {
      classToAdd = 'dark-theme';
      classToRemove = 'light-theme';
    } else {
      classToAdd = 'light-theme';
      classToRemove = 'dark-theme';
    }

    this.overlayContainer.getContainerElement().classList.remove(classToRemove);
    this.overlayContainer.getContainerElement().classList.add(classToAdd);
    document.body.classList.remove(classToRemove);
    document.body.classList.add(classToAdd);
  }
}
