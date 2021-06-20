import {Component} from '@angular/core';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'btc-world-map',
  templateUrl: './world-map.component.html'
})
export class WorldMapComponent {

  constructor(private configService: ConfigService) {
  }

  get logoSource(): string {
    if (this.configService.darkmode) {
      return 'assets/images/amcharts_dark_transparent.png';
    } else {
      return 'assets/images/amcharts_light_transparent.png';
    }
  }
}
