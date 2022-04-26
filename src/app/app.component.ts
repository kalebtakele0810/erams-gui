import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ERAManagementSystem';
  currentRoute: string = ''

  constructor(private authService: AuthService, private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url
        console.log(this.currentRoute)
      }
    })
  }

  ngOnInit(): void {
    console.log("current route is " + this.currentRoute)

  }
}
