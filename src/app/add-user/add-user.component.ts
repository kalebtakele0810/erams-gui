import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userProfile = new FormGroup({
      userName: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      position: new FormControl(''),
      directorate: new FormControl(''),
      badgeNumber: new FormControl(''),
      telephone: new FormControl('')
    }
  )

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated())
      this.router.navigate(['login'])
    this.userProfile.patchValue({
      userName: history.state.user.userName,
      firstName: history.state.user.firstName,
      lastName: history.state.user.lastName,
      position: history.state.user.position,
      directorate: history.state.user.directorate,
      badgeNumber: history.state.user.badgeNumber,
      telephone: history.state.user.telephone,
    })
    console.log(this.userProfile.value)
  }
  save() {

  }
}
