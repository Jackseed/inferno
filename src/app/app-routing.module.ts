// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { LoginComponent } from './auth/login/login.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MenuComponent } from './games/menu/menu.component';
import { FormComponent } from './games/form/form.component';
import { ListComponent } from './games/list/list.component';
// Guards
import {
  AuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { SyncActiveGuard } from './auth/guard/sync-active.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    canActivate: [AuthGuard, SyncActiveGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'games/creation',
    component: FormComponent,
    canActivate: [AuthGuard, SyncActiveGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'games/join',
    component: ListComponent,
    canActivate: [AuthGuard, SyncActiveGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard, SyncActiveGuard],

    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'games/:id',
    component: CanvasComponent,
    canActivate: [AuthGuard, SyncActiveGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
