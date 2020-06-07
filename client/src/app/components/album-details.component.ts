import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';

import {AlbumService} from '../services/album.service';
import {SongService} from '../services/song.service';
import {GLOBAL} from '../services/global';
import {Song} from '../models/song';
import {Album} from '../models/album';

@Component({

    selector : 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers : [UserService,  AlbumService, SongService]

})
export class AlbumDetailsComponent implements OnInit{

    
    public Album: Album;
    public artistId:string;
    public identity;
    public token;
    public url:string;
    public  alertMessage:string;
    public album;
    public songs : Song[];

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _albumService:AlbumService,
        private _songService:SongService,
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
            
    }

    ngOnInit(){

        console.log('album-details.component.ts cargado');
        //sacar album de la bd
        this.getAlbum();
    }


    getAlbum(){

        console.log("the method works");

        this._route.params.forEach((params : Params) =>{

            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response =>{

                    if(!response.album){

                        this._router.navigate(['/']);

                    }
                    else{
                        this.album = response.album;                        
                        //this.artistId = response.artist._id;
                        //sacar las canciones del artista

                        this._songService.getSongs(this.token, response.album._id).subscribe(

                            response =>{
                                
                                console.log("response.album");
                                console.log(response.album);

                                if(!response.songs){
                                    console.log("Este album no tiene canciones");
                                    this.alertMessage = "Este album no tiene canciones";  
                                    
                                }
                                else{
                                    console.log("songs");
                                    console.log(response.songs);    
                                    this.songs = response.songs;
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
    
    onCancelSong(){
        
        this.confirmado = null;
    }

    onDeleteSong(id){

        this._songService.deleteSong(this.token, id).subscribe(
                
            response =>{

                if(!response.song){

                    alert("error en el servidor");
                }
                else{

                    this.getAlbum();
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

    startPlayer(song){

        let songPlayer = JSON.stringify(song);
        let file_path = this.url + 'get-file-song/' + song.file;
        let image_path = this.url + 'get-image-album/' + song.album.image;

        localStorage.setItem('sound_song', songPlayer);
        document.getElementById("mp3-source").setAttribute("src", file_path);

        (document.getElementById("player")as any).load();
        (document.getElementById("player")as any).play();

        document.getElementById("play-song-title").innerHTML = song.name;
        document.getElementById("play-song-artist").innerHTML = song.album.artist.name;
        document.getElementById("play-image-album").setAttribute("src", image_path);

    }
}