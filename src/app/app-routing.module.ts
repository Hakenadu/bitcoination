import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {MapComponent} from './map/map.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  },
  {
    path: 'map',
    component: MapComponent,
    data: {name: 'MapPage'}
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {name: 'AboutPage'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
