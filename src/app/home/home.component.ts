import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  opened: boolean = false
  currentRoute: string = ""

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url == "/home") {
          this.currentRoute = "home"
          this.opened = true
          console.log("opened = ", this.opened)
        }
      }
    })
  }

  ngOnInit(): void {
    if (this.currentRoute == "home")
      this.opened = true
    this.expandCollapse()
    console.log(this.opened)
  }

  show() {
    console.log("Show method called")
    let element = document.getElementById("mainC")
    // @ts-ignore
    element.classList.add("layout-menu-expanded")
  }

  hide() {
    let element = document.getElementById("mainC")
    // @ts-ignore
    element.classList.remove("layout-menu-expanded")
  }

  toggle() {
    this.opened = !this.opened;
  }

  expandCollapse() {
    let e = document.querySelectorAll(".menu-toggle")
    if (e != null) {
      e.forEach((t: Element) => {
          t.addEventListener("click", (event) => {
              let n = t.closest(".menu-item")
              if (n != null) {
                if (n.classList.contains("open")) {
                  n.classList.remove("open")
                } else {
                  n.classList.add("open")
                }
              }
            }
          )
        }
      )
    }
  }
}
