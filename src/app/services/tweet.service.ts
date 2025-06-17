import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from "../services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class TweetService {

apiURL = 'https://cerdos-spring.onrender.com/';
  token: string = '';
  
  constructor(
    private http: HttpClient,
    private storageService: StorageService)
  {
    this.token = this.storageService.getSession("token");
    console.log("mi token", this.token);
    if (!this.token) {
    console.error('Token no disponible');
  }
  }


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*',
      'Authorization':'Bearer '  + this.token
    })
  }
  
  
errorMessage = '';
  getHttpOptions() {
    const token = this.storageService.getSession('token'); 
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
  
  }
 

  getTweets(): Observable<Tweet[]> {
    //console.log("tweets: " + this.apiURL + 'api/tweets/all');
    
    return this.http.get<Tweet[]>(this.apiURL + 'api/tweets/all', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  

  postTweet(newTweet: Tweet): Observable<any> {

    return this.http.post(this.apiURL + 'api/tweets/create', newTweet, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

 // Error handling
  handleError(error : any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    window.alert(errorMessage);
    return throwError(errorMessage);
 }
}
