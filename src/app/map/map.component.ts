import {Component} from '@angular/core';
import {latLng, tileLayer} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18})
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
