import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Credential } from '../models/user/Credential';
import { Router } from '@angular/router';
import { Token } from '../models/user/Token';
import { StorageService } from "../services/storage.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

    constructor( private userService: UserService,
                 private storageService : StorageService,
  	             private router: Router
    )
    { }

    email : String = "";
    password : String = "";
    
    myLogin = new Token();

    callLogin() {

      //alert("login...");

     var myCredential = new Credential();

     myCredential.email = this.email;
     myCredential.password = this.password;
   

     //this.myLogin = 
     this.userService.postLogin(
        myCredential
       ).subscribe((data : any)  => {
         
       console.log('user logged: ', JSON.stringify(data));
       this.storageService.setSession("email", data.email);
       //console.log("Token : " + JSON.parse(JSON.stringify(data)).accessToken);
       this.storageService.setSession("userId", data.id);
       this.storageService.setSession("username", data.username);
       console.log("id", data.id);
       this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).accessToken);

       this.router.navigate(['/home']);

    }, (error) => {
       console.log('there was an error sending the query', error);
       myCredential.email = "";
       myCredential.password = "";
       alert(error);
      });



  
     if (this.myLogin.accessToken != "")
        this.router.navigate(['/home']);

     console.log(this.myLogin);

    }
     
}
