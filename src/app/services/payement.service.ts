import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse,HttpEvent, HttpParams, HttpRequest, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PayementService {

  httpHeader = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'*',
      'Accept': 'application/json, text/plain',
      'Access-Control-Allow-Credentials': 'true',
    })
  };


  constructor(
    private http: HttpClient,
    private router : Router
  ) 
  { }



  getData(url, data){
    const headers = new HttpHeaders({
        });
      let ll =environment.url+url;
      return this.http.post(ll, data, {'headers':headers});
    }


   handleError(error: HttpErrorResponse) {
    // this.load.hideLoader();
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
     // this.presentToast(error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    //this.presentToast(error.status);
    // return an observable with a user-facing error message
      return throwError(
      'Something bad happened; please try again later.');
  };


  
}
