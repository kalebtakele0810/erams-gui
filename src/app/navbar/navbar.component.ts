import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  path: string = ''
  subPath: string = ''
  currentRoute: string = ''

  constructor(private authService: AuthService, private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url
        if (this.currentRoute == "/home/add-project") {
          this.path = `Home / Project Planning/`
          this.subPath = ` Add Project`
        }
        else if(this.currentRoute == "/home/add-contracts"){
          this.path = `Home / Project Planning/`
          this.subPath = " Add Contracts"
        }
      }
    })
  }


  ngOnInit(): void {

  }

  logout(){
    this.authService.logout()
    this.router.navigate(['login'])
  }

  isAuthenticated(): boolean{
    return this.authService.isAuthenticated()
  }

  notAuthenticated(): boolean{
    return !this.authService.isAuthenticated()
  }
  show() {
    console.log("Show method called")
    let element = document.getElementById("mainC")
    // @ts-ignore
    element.classList.add("layout-menu-expanded")
  }
}
