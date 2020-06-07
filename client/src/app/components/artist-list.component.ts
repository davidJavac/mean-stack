import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';

@Component({

    selector : 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers : [UserService, ArtistService]

})
export class ArtistListComponent implements OnInit{

    public titulo:string;
    public artists : Artist[];
    public artist : Artist;
    public identity;
    public token;
    public url:string;
    public next_page;
    public pre_page;
    
    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _artistService:ArtistService
    ){

        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.pre_page = 1;
    }

    ngOnInit(){

        console.log('artist-list.component.ts cargado');
        //conseguir el listado de artistas
        this.getArtists();
    }

    public confirmado;

    onDeleteConfirm(id){

        this.confirmado = id;

    }
    onCancelArtist(){

        this.confirmado=null;
    }

    onDeleteArtist(id){
        console.log(id);
        this._artistService.deleteArtist(this.token, id).subscribe(

            response =>{
                
                console.log("response delete");
                console.log(response);

                if(!response.artistRemoved){

                    alert("Error en el servidor");

                }
                this.getArtists();
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

    getArtists(){

        this._route.params.forEach((params : Params) =>{

            let page = +params['page'];

            if(!page){

                page = 1;
            }
            else{

                this.next_page = page + 1;
                this.pre_page = page -1;

                if(this.pre_page == 0){

                    this.pre_page = 1;
                }
            }

            this._artistService.getArtists(this.token, page).subscribe(
                response =>{

                    if(!response.artists){

                        this._router.navigate(['/']);

                    }
                    else{
                        this.artists = response.artists;
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
        })
    }
}