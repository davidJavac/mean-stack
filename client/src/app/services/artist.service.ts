import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
import {Artist} from '../models/artist';

@Injectable()
export class ArtistService{

    public url:string;
    
    constructor(private _http:Http){

        this.url = GLOBAL.url;

    }

    getArtists(token, page){

        let headers = new Headers({

            'Content-Type' : 'Application/json',
            'Authorization' : token
        });

        let options = new RequestOptions({headers : headers});
        return this._http.get(this.url + 'artists/' + page, options).map(res => res.json());
    }
    
    getArtist(token, id:string){

        let headers = new Headers({

            'Content-Type' : 'Application/json',
            'Authorization' : token
        });

        let options = new RequestOptions({headers : headers});
        return this._http.get(this.url + 'artist/' + id, options).map(res => res.json());
    }
    
    addArtist(token, artist:Artist){
        
        let params = JSON.stringify(artist);
        let headers = new Headers({
            
            'Content-Type' : 'Application/json',
            'Authorization' : token
        });
        
        return this._http.post(this.url + 'artist', params, {headers : headers}).
        map(res => res.json());
    }
    
    editArtist(token, id:string, artist:Artist){
        
        let params = JSON.stringify(artist);
        let headers = new Headers({
            
            'Content-Type' : 'Application/json',
            'Authorization' : token
        });
        let response = this._http.put(this.url + 'update-artist/' + id, params, {headers : headers}).
        map(res => res.json());

        return response;
    }
    
    deleteArtist(token, id:string){

        let headers = new Headers({

            'Content-Type' : 'Application/json',
            'Authorization' : token
        });

        let options = new RequestOptions({headers : headers});
        return this._http.delete(this.url + 'delete-artist/' + id, options).map(res => res.json());
    }
    
}
