import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {MapComponent} from './map/map.component';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';
import {TermsOfServiceComponent} from './terms-of-service/terms-of-service.component';

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
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
    data: {name: 'TermsOfServicePage'}
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: {name: 'PrivacyPolicyPage'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
