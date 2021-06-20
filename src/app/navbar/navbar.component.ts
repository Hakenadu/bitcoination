import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfigService} from '../services/config.service';

export interface NavigationEntry {
  name: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'btc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  private _collapsed = true;

  navigationEntries: NavigationEntry[] = [
    {
      name: 'Map',
      path: '/map',
      icon: 'map'
    },
    {
      name: 'About',
      path: '/about',
      icon: 'info'
    }
  ];

  /*
   * Wir blockieren beim Setzen von _collapsed kurzfristig die Navbar zur Vermeidung von inkonsistentem
   * Verhalten auf Basis extrem schneller Klicks.
   */
  navBarLocked = false;

  @ViewChild('navbarToggleButton', {read: ElementRef})
  private navbarToggler: ElementRef<HTMLButtonElement> | undefined;

  constructor(private router: Router,
              private matSnackbar: MatSnackBar,
              public configService: ConfigService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hide();
      }
    });
  }

  hide() {
    if (this.collapsed) {
      return;
    }
    this.navbarToggler?.nativeElement.click();
  }

  isActivated(navigationEntry: NavigationEntry): boolean {
    return this.router.url === navigationEntry.path;
  }

  get collapsed(): boolean {
    return this._collapsed;
  }

  set collapsed(collapsed: boolean) {
    if (this.navBarLocked) {
      return;
    }
    this.navBarLocked = true;
    this._collapsed = collapsed;
    setTimeout(() => this.navBarLocked = false, 300);
  }

  showWipText(): void {
    this.matSnackbar.open(
      'This page is currently under construction. Doesn\'t harm to frequently visit us to check for updates ;-)',
      'OK',
      {
        duration: 6500,
        horizontalPosition: 'end'
      }
    );
  }
}
