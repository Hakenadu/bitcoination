import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

const KEY_DARKMODE = 'bitcoinations_darkmode';
const KEY_SHOW_MINIMAP = 'bitcoinations_show_minimap';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  darkmode$ = new BehaviorSubject<boolean>(this.darkmode);
  showMinimap$ = new BehaviorSubject<boolean>(this.showMinimap);

  constructor() {
  }

  set showMinimap(showMinimap: boolean) {
    localStorage.setItem(KEY_SHOW_MINIMAP, showMinimap ? 'true' : 'false');
    this.showMinimap$.next(showMinimap);
  }

  get showMinimap(): boolean {
    return 'true' === localStorage.getItem(KEY_SHOW_MINIMAP);
  }

  set darkmode(darkmode: boolean) {
    localStorage.setItem(KEY_DARKMODE, darkmode ? 'true' : 'false');
    this.darkmode$.next(darkmode);
  }

  get darkmode(): boolean {
    return 'true' === localStorage.getItem(KEY_DARKMODE);
  }
}
