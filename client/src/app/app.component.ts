import { Component, OnInit } from '@angular/core';
import {User} from './models/user';
import {UserService} from './services/user.service';
import {GLOBAL} from './services/global';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers : [UserService]
})
export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  public user : User;
  public userRegister : User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url:string;
  constructor(
      private _userService :UserService,
      private router:Router
    ){

    this.user = new User('','','','','','ROLE_USER', '');
    this.userRegister = new User('','','','','','ROLE_USER', '');
    this.url = GLOBAL.url;
  }
  
  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    
    console.log(this.identity);
    console.log(this.token);

  }

  public onSubmit(){

    //console.log(this.user);
    //conseguir los datos de usuario identificado
    this._userService.signUp(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert("El usuario no esta correctamente logueado");
        }
        else{

          //crear elemento en el local storage para tener al usuario en session
          localStorage.setItem('identity', JSON.stringify(identity));
          console.log('get identity from login');
          console.log(this._userService.getIdentity());
          this._userService.signUp(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;
              
              if(this.token.length <= 0){
                alert("El token no se ha generado");
              }
              else{
                
                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER', '');
                this.errorMessage = '';
                this.alertRegister = '';
              }
            },
            error =>{
              
              var error_message = <any>error;
              
              if(error_message != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error_message);
              }
            }
            )
            //conseguir el token para enviarlo en cada peticion
        }
      },
      error =>{

        var error_message = <any>error;

        if(error_message != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error_message);
        }
      }
      )
    }
    
  
    onSubmitRegister(){
      
      //console.log("userRegister.name in onSubmitRegister " + this.userRegister.name);
      console.log(this.userRegister);

      //this.userRegister = new User('','','','','','ROLE_USER', '');

      this._userService.register(this.userRegister).subscribe(
        
        response =>{
          
          let user = response.user;

          this.userRegister = user;

          if(!user._id){

            this.alertRegister = response.message;
            //this.userRegister = new User('','','','','','ROLE_USER', '');
          }
          else{
    

            this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.userRegister.email;
            this.userRegister = new User('','','','','','ROLE_USER', '');
          }
        },
        error => {
          
          var error_message = <any>error;
      
          if(error_message != null){
            var body = JSON.parse(error._body);
            this.alertRegister = body.message;  
            console.log(error_message);
          }
          
        }
        
        );

  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('identity');

    localStorage.clear();
    this.identity = null;
    this.token = null;

    this.router.navigate(['/']);
  }
}
