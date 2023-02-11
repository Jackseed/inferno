// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Guards
import {
  AuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { ActiveGuard } from './auth/guard/sync-active.guard';
// Components
import { LoginComponent } from './auth/login/login.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MenuComponent } from './games/menu/menu.component';
import { FormComponent } from './games/form/form.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    canActivate: [AuthGuard, ActiveGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],

    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'games/:id',
    component: CanvasComponent,
    canActivate: [AuthGuard, ActiveGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
