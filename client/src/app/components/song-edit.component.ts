import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {SongService} from '../services/song.service';
import {UploadService} from '../services/upload.service';
import {GLOBAL} from '../services/global';
import {Song} from '../models/song';

@Component({

    selector : 'song-edit',
    templateUrl: '../views/song-add.html',
    providers : [UserService, SongService, UploadService]

})
export class SongEditComponent implements OnInit{

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
        private _uploadService:UploadService,

    ){

        this.titulo = 'Editar cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.is_edit= true;    
    }

    ngOnInit(){
        console.log("song-edit cargado");
        //sacar la cancion a editar
        this.getSong();
    }
    
    getSong(){
        
        this._route.params.forEach((params : Params) =>{
            let id = params['id'];
            this._songService.getSong(this.token, id).subscribe(

                response =>{

                    if(!response.song){

                        this._router.navigate(['/'])
                    }
                    else{

                        this.song = response.song;

                    }
                },
                error =>{
        
                    var error_message = <any>error;
              
                        if(error_message != null){
                            var body = JSON.parse(error._body);
                            this.alertMessage = body.message;  
                            console.log(error_message);
                        }
                }

            );
        });            

    }

    onSubmit(){
     
        console.log(this.song);
        this._route.params.forEach((params : Params) =>{
            let id = params['id'];

            this._songService.editSong(this.token, id, this.song).subscribe(

                response =>{
                    console.log("response");
                    console.log(response.song);
                    if(!response.song){
                        
                        this.alertMessage = 'Error en el servidor';
                    }
                    else{
                        this.alertMessage = 'la cancion se ha actualizado correctamente';
                        //this.song = response.song.album;
                        //subir el fichero de audio
                        //this._router.navigate(['/edit-song', response.song._id]);

                        if(!this.filesToUpload){

                            this._router.navigate(['/album', response.song.album]);
                        }
                        else{

                            this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file').
                            then(
                                (result) =>{
                                    this._router.navigate(['/album', response.song.album]);
                                },
                                (error) =>{
                                    console.log(error);
                                }
                            );

                        }
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

    public filesToUpload;

    fileChangeEvent(fileInput:any){

        this.filesToUpload = <Array<File>>fileInput.target.files;
        
    }
}