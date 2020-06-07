import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {AlbumService} from '../services/album.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';
import {Album} from '../models/album';

@Component({

    selector : 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers : [UserService, ArtistService, AlbumService]

})
export class ArtistDetailsComponent implements OnInit{

    public artist : Artist;
    public albums: Album[]
    public artistId:string;
    public identity;
    public token;
    public url:string;
    public  alertMessage:string;

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _artistService:ArtistService,
        private _albumService:AlbumService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
            
    }

    ngOnInit(){

        console.log('artist-details.component.ts cargado');
        //llamar al metodo del api para sacar un artista en base a su id
        this.getArtist();
    }


    getArtist(){
        this._route.params.forEach((params : Params) =>{

            let id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                response =>{

                    if(!response.artist){

                        this._router.navigate(['/']);

                    }
                    else{
                        this.artist = response.artist;                        
                        this.artistId = response.artist._id;
                        //sacar los albums del artista

                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(

                            response =>{
                                
                                console.log("response.artist_id");
                                console.log(response.artist_id);

                                if(!response.albums){
                                    
                                    this.alertMessage = "Este artista no tiene album";  
                                    
                                }
                                else{
                                    console.log("albums");
                                    console.log(response.albums);    
                                    this.albums = response.albums;
                                }
                            },
                            error =>{
            
                                var error_message = <any>error;
                          
                                    if(error_message != null){
                                        var body = JSON.parse(error._body);
                                        //this.alertMessage = body.message;  
                                        console.log(error_message);
                                    }
                            }
                        );
                    }
                },


                error =>{

                    var error_message = <any>error;
              
                        if(error_message != null){
                            var body = JSON.parse(error._body);
                            //this.alertMessage = body.message;  
                            console.log(error_message);
                        }
                }
            )
        });

    }

    public confirmado;

    onDeleteConfirm(id){

        this.confirmado = id;
    }

    onDeleteAlbum(id){

        this._albumService.deleteAlbum(this.token, id).subscribe(
            response =>{

                if(!response.album){

                    alert("Error en el servidor");
                }
                else{

                    this.getArtist();
                }
            },
            error =>{

                var error_message = <any>error;
          
                    if(error_message != null){
                        var body = JSON.parse(error._body);
                        //this.alertMessage = body.message;  
                        console.log(error_message);
                    }
            }
        );
    }

    onCancelAlbum(){

        this.confirmado = null;
    }
}