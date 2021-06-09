import {Component, ViewChild} from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';

@Component({
  selector: 'btc-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild(NavbarComponent)
  navbar: NavbarComponent | undefined;
}
