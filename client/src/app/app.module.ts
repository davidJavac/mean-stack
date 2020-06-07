import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing, appRoutingProviders} from './app.routing';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';

//user
import {UserEditComponent} from './components/user-edit-componet';
//artist
import {ArtistListComponent} from './components/artist-list.component';
import {ArtistAddComponent} from './components/artist-add.component';
import {ArtistEditComponent} from './components/artist-edit.component';
import {ArtistDetailsComponent} from './components/artist-details.component';
//album
import {AlbumAddComponent} from './components/album-add.component';
import {AlbumEditComponent} from './components/album-edit.component';
import {AlbumDetailsComponent} from './components/album-details.component';
//song
import {SongAddComponent} from './components/song-add.component';
import {SongEditComponent} from './components/song-edit.component';
//player
import {PlayerComponent} from './components/player.component';

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    HomeComponent,
    ArtistListComponent,
    ArtistAddComponent,
    SongAddComponent,
    SongEditComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    ArtistEditComponent,
    ArtistDetailsComponent,
    AlbumDetailsComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
