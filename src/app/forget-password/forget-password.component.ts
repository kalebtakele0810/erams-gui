import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ForgetPasswordModel} from "../../models/ForgetPasswordModel";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  emailGroup = new FormGroup({
    email: new FormControl('')
  })
  error = ''

  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
  }

  resetPassword() {
    this.spinner.show()
    if (this.emailGroup.value.email == '')
      this.error = 'Email can not be empty'
    else {
      let forgetPasswordModel: ForgetPasswordModel = {
        Email: this.emailGroup.value.email
      }

      this.authService.forgetPassword(forgetPasswordModel).subscribe({
          next: (response) => {
            this.spinner.hide()
            console.log("Password reset successfully")
            this.router.navigate(['password-reset-confirmed'])
          },
          error: (err) => {
            this.spinner.hide()
            console.log(err.error)
          }
        }
      )
      console.log(forgetPasswordModel)
    }
  }


}
