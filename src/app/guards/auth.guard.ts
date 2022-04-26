import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  errorMessage: string = ''

  constructor(private router: Router, private jwt: JwtHelperService) {
  }

  canActivate() {
    const token = localStorage.getItem("jwt")

    if (token && !this.jwt.isTokenExpired(token)) {
      return true
    }
    else if(token && this.jwt.isTokenExpired(token)){
      this.errorMessage = "Session expired, please login again"
      this.router.navigate(['login'], { queryParams: {"error_message": this.errorMessage}})
      console.log("Token expired, " , this.errorMessage)
      return false
    }
    else if(!token) {
      this.router.navigate(['login'], {queryParams: {"error_message": this.errorMessage}})
      return false
    }
    this.router.navigate(['login'], {queryParams: {"error_message": this.errorMessage}})
    return false
  }
}
