import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from "../services/storage.service";
import { TweetComment } from '../models/tweets/TweetComment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
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


getCommentsByTweet(tweetId: number): Observable<TweetComment[]> {
  return this.http.get<TweetComment[]>(`${this.apiURL}api/comments/tweet/${tweetId}`, this.getHttpOptions())
    .pipe(
      
      retry(1),
      catchError(this.handleError)
    );
    
}


 
 createComment(comment: { tweetId: number; content: string }): Observable<TweetComment> {
  return this.http.post<TweetComment>(`${this.apiURL}api/comments/create`, comment, this.getHttpOptions())
    .pipe(
      retry(1),
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
