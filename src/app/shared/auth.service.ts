import { Product } from './product';
import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint: string = 'https://intermediate-test-v-2-web-test.apps.ocp.tmrnd.com.my/api/';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }
  formData: Product = new Product();
  list: Product[] = [];

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${this.endpoint}auth`, user)
      .subscribe((res: any) => {
        localStorage.setItem('token', res.token)
        localStorage.setItem('token_expiry', res.tokenExpiry)
        localStorage.setItem('status', res.success)

         this.getProducts().subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['home/']);
        })
      })
  }
  getToken() {
    return localStorage.getItem('token');
  }
  get isLoggedIn(): boolean {
    let status = localStorage.getItem('status');
    return (status) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  getProducts() : Observable<any> {
    let api = `${this.endpoint}data/productList`;
    return this.http.get<any>(api, { headers: this.headers }).pipe(
      map((res: any) => {
        this.list = res as Product[]; 
        return res || {}
      }),
      catchError(this.handleError)
    )
   }

   getDetail() : Observable<any> {
     var id : string = "61f00264a0d9a7e79d94b02a" ;
    let api = `${this.endpoint}data/alert/list/:${id}indexNumber=1&pageSize=5&startDate=2020-02-23&endDate=2022-02-24`;
    console.log('called--');
    return this.http.get<any>(api, { headers: this.headers }).pipe(
      map((res: any) => {
        console.log('called**');
        console.log(res);
        return res || {}
      }),
      catchError(this.handleError)
    )
   }

/*    create(){
    let api = `${this.endpoint}data/productList`;
    return this.http.post(api, this.formData);
   } */
  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}