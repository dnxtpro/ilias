import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewMatchComponent } from './new-match/new-match.component';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { AddPlayerComponent } from './add-player/add-player.component';
import { PlayerDetailsDialogComponent } from './player-details-dialog/player-details-dialog.component';
import { MatchLiveComponent } from './match-live/match-live.component';
import { PlayerModalComponent } from './player-list-modal/player-list-modal.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { MatchDetailsXddComponent } from './match-details-xdd/match-details-xdd.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { ChoosePlayersComponent } from './choose-players/choose-players.component';
import { MarcadorComponent } from './marcador/marcador.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewMatchComponent,
    MatchDetailsComponent,
    PlayerListComponent,
    AddPlayerComponent,
    PlayerDetailsDialogComponent,
    MatchLiveComponent,
    PlayerModalComponent,
    DetailsPageComponent,
    MatchDetailsXddComponent,
    ChoosePlayersComponent,
    MarcadorComponent,
  ],
  imports: [
    RouterModule, 
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule, 
    ReactiveFormsModule,
    DatePipe,
    NgxChartsModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
