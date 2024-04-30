import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./pages/user/login/login.component";
import {LayoutComponent} from "./pages/layout/layout.component";
import {RegisterComponent} from "./pages/user/register/register.component";

const routes: Routes = [
  {path: 'login', pathMatch: 'full', component: LoginComponent},
  {path: 'register', pathMatch: 'full', component: RegisterComponent},
  {path: '', component: LayoutComponent},
  {path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
