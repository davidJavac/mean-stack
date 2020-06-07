import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {SongService} from '../services/song.service';
import {GLOBAL} from '../services/global';
import {Song} from '../models/song';

@Component({

    selector : 'song-add',
    templateUrl: '../views/song-add.html',
    providers : [UserService, SongService]

})
export class SongAddComponent implements OnInit{

    public song : Song;
    public titulo:string;
    public identity;
    public token;
    public url:string;
    public  alertMessage:string;
    public is_edit;

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _songService:SongService,

    ){

        this.titulo = 'Crear nueva cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.is_edit= false;    
    }

    ngOnInit(){
        console.log("song-add cargado");
    }

    onSubmit(){
     
        console.log(this.song);
        this._route.params.forEach((params : Params) =>{
            let album_id = params['album'];
            this.song.album = album_id;
           

            this._songService.addSong(this.token, this.song).subscribe(

                response =>{
                    console.log("response");
                    console.log(response.song);
                    if(!response.song){
                        
                        this.alertMessage = 'Error en el servidor';
                    }
                    else{
                        this.alertMessage = 'La cancion se ha creado correctamente';
                        this.song = response.song.album;
                        this._router.navigate(['/edit-song', response.song._id]);
        
                    }
                },
                error =>{
        
                    var error_message = <any>error;
              
                        if(error_message != null){
                            var body = JSON.parse(error._body);
                            this.alertMessage = body.message;  
                            console.log(error_message);
                        }
                });
        });
    }

    fileChangeEvent(event){

        
    }
}