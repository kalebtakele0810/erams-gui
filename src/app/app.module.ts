import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {NavbarComponent} from './navbar/navbar.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgxSpinnerModule} from "ngx-spinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DashboardComponent} from './dashboard/dashboard.component';
import {PasswordResetConfirmedComponent} from './password-reset-confirmed/password-reset-confirmed.component';
import {AddUserComponent} from './add-user/add-user.component';
import {AddProjectComponent} from './add-project/add-project.component';
import {ToastrModule} from "ngx-toastr";
import {NgToastModule} from "ng-angular-popup";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatSidenavModule} from "@angular/material/sidenav";
import {AddContractComponent} from './add-contract/add-contract.component';
import {JwtModule} from "@auth0/angular-jwt";
import {Constants} from "./util/constants";
import {AuthGuard} from "./guards/auth.guard";
import {DataTablesModule} from "angular-datatables";
import {MatDialogModule} from "@angular/material/dialog";
import {DatePickerDialogComponent} from "./date-picker-dialog/date-picker-dialog.component";
import {ContractsReportComponent} from "./contracts-report/contracts-report.component";

export function tokenGetter() {
  const lastLogin = localStorage.getItem("last_login")
  if (lastLogin) {
    const now = new Date()
    const last = new Date(lastLogin)
    const diff = now.getTime() - last.getTime()
    const diffMinutes = diff / 60000
    if (diffMinutes >= 5) {
      localStorage.removeItem("jwt")
    } else {
      localStorage.setItem("last_login", now.toLocaleString())
    }
  }
  console.log("tokenGetter() called")
  return localStorage.getItem("jwt")
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    HomeComponent,
    ForgetPasswordComponent,
    DashboardComponent,
    PasswordResetConfirmedComponent,
    AddUserComponent,
    AddProjectComponent,
    AddContractComponent,
    DatePickerDialogComponent,
    ContractsReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      preventDuplicates: true
    }),
    NgToastModule,
    NgbModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    MatSidenavModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [Constants.domain],
        disallowedRoutes: []
      }
    }),
    DataTablesModule,
    MatDialogModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
