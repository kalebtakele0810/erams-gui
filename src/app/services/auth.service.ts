import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginModel} from "../../models/LoginModel";
import {Observable} from "rxjs";
import {ForgetPasswordModel} from "../../models/ForgetPasswordModel";
import {Constants} from "../util/constants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = `${Constants.baseUrl}/auth`

  constructor(private http: HttpClient) {
  }

  login(user: LoginModel): Observable<any> {
    return this.http.post(this.baseUrl + "/login", user)
  }

  forgetPassword(forgetPasswordModel: ForgetPasswordModel): Observable<any> {
    return this.http.put(this.baseUrl + '/forget-password', forgetPasswordModel)
  }


  logout() {
    localStorage.removeItem("jwt")
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("jwt")
    return !!token;
  }

  notAuthenticated(): boolean {
    return !this.isAuthenticated()
  }

  getToken() {
    return localStorage.getItem("jwt")
  }
}
