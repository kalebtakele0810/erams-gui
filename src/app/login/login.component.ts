import {Component, OnInit} from '@angular/core';
import {LoginModel} from "../../models/LoginModel";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: boolean = false
  errorMessage: string = ''


  user = new FormGroup({
    UserName: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      if (query["error_message"] != undefined) {
        this.errorMessage = query["error_message"]
        this.error = this.errorMessage.length > 0
      }
    })
  }

  get name() {
    return this.user.get('UserName')
  }

  get password() {
    return this.user.get('Password')
  }

  login() {
    if (this.user.valid) {
      this.spinner.show()

      let loginModel: LoginModel = {
        "UserName": this.user.value.UserName,
        "Password": this.user.value.Password
      }
      console.log(loginModel)
      this.authService.login(loginModel).subscribe({
          next: (response) => {
            this.spinner.hide()
            console.log(response.user)
            localStorage.setItem("jwt", response.token)
            this.router.navigate(['home'])
          },
          error: (error) => {
            this.spinner.hide()

            console.log(error.error)
          }
        }
      )
    }
  }

  public hideShow() {
    let t = document.querySelectorAll(".form-password-toggle i");
    null != t && t.forEach((function (t) {
      t.addEventListener("click", (function (e) {
        e.preventDefault();
        let n = t.closest(".form-password-toggle")
        // @ts-ignore
        let i = n.querySelector("i")
        // @ts-ignore
        let o = n.querySelector("input");

        // @ts-ignore
        if (o.getAttribute("type") == "text") {
          // @ts-ignore
          o.setAttribute("type", "password")
          // @ts-ignore
          i.classList.replace("bx-show", "bx-hide")
        } else { // @ts-ignore
          if (o.getAttribute("type") == "password") {
            // @ts-ignore
            o.setAttribute("type", "text")
            // @ts-ignore
            i.classList.replace("bx-hide", "bx-show")
          }
        }
      }))
    }))
  }
}
