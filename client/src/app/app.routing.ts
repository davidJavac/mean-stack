import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//import user
import {UserEditComponent} from './components/user-edit-componet';
//import artist
import {ArtistListComponent} from './components/artist-list.component';
import {HomeComponent} from './components/home.component';
import { AppComponent } from './app.component';
import {ArtistAddComponent} from './components/artist-add.component';
import {ArtistEditComponent} from './components/artist-edit.component';
import {AlbumEditComponent} from './components/album-edit.component';
import {ArtistDetailsComponent} from './components/artist-details.component';
import {AlbumDetailsComponent} from './components/album-details.component';

//import album
import {AlbumAddComponent} from './components/album-add.component';

//import song
import {SongAddComponent} from './components/song-add.component';
import {SongEditComponent} from './components/song-edit.component';

const appRoutes:Routes = [

    {path : '', component : HomeComponent},
    {path : '', component : AppComponent},
    {path : 'artists/:page', component : ArtistListComponent},
    {path : 'create-artist', component : ArtistAddComponent},
    {path : 'create-album/:artist', component : AlbumAddComponent},
    {path : 'edit-artist/:id', component : ArtistEditComponent},
    {path : 'edit-album/:id', component : AlbumEditComponent},
    {path : 'edit-song/:id', component : SongEditComponent},
    {path : 'album/:id', component : AlbumDetailsComponent},
    {path : 'artist/:id', component : ArtistDetailsComponent},
    {path : 'create-song/:album', component : SongAddComponent},
    {path : 'mis-datos', component : UserEditComponent},
    {path : '**', component : HomeComponent}
]

export const appRoutingProviders : any[] = [];
export const routing:ModuleWithProviders = RouterModule.forRoot(appRoutes);
