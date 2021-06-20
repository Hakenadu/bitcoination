import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavbarComponent} from './navbar/navbar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MapComponent} from './map/map.component';
import {MatCardModule} from '@angular/material/card';
import {MapStatisticsComponent} from './map/statistics/map-statistics.component';
import {MatTableModule} from '@angular/material/table';
import {MapChartComponent} from './map/chart/map-chart.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {HttpClientModule} from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {PopupComponent} from './map/popup/popup.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatomoModule} from 'ngx-matomo';
import {AboutComponent} from './about/about.component';
import {StatisticsTableComponent} from './map/statistics/table/statistics-table.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PrivacyComponent} from './about/privacy/privacy.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {BitcoinPricesComponent} from './about/coingecko/bitcoin-prices.component';
import {BtcPricePreviewComponent} from './map/btc-price-preview/btc-price-preview.component';
import {MarkdownModule} from 'ngx-markdown';
import {DonationsComponent} from './about/donations/donations.component';
import {WorldMapComponent} from './about/world-map/world-map.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    MapStatisticsComponent,
    MapChartComponent,
    PopupComponent,
    AboutComponent,
    StatisticsTableComponent,
    PrivacyComponent,
    BitcoinPricesComponent,
    BtcPricePreviewComponent,
    DonationsComponent,
    WorldMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTabsModule,
    NgbModule,
    HttpClientModule,
    MatomoModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MarkdownModule.forRoot(),
    ClipboardModule,
    MatSnackBarModule,
    MatMenuModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
