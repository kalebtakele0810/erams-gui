import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {HomeComponent} from "./home/home.component";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PasswordResetConfirmedComponent} from "./password-reset-confirmed/password-reset-confirmed.component";
import {AddProjectComponent} from "./add-project/add-project.component";
import {AddContractComponent} from "./add-contract/add-contract.component";
import {ContractsReportComponent} from "./contracts-report/contracts-report.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'add-project',
        component: AddProjectComponent
      },
      {
        path: 'add-contracts',
        component: AddContractComponent
      },
      {
        path: 'contracts-report',
        component: ContractsReportComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent
  },
  {
    path: 'password-reset-confirmed',
    component: PasswordResetConfirmedComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
