// Angular
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
// AngularFire
import { Auth, authState } from '@angular/fire/auth';
// Rxjs
import { first, tap } from 'rxjs/operators';
// States
import { AuthStore } from '../_state';
import { PlayerStore } from 'src/app/players/_state';

@Injectable({
  providedIn: 'root',
})
export class ActiveGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private store: AuthStore,
    private playerStore: PlayerStore
  ) {}
  canActivate() {
    authState(this.auth)
      .pipe(
        tap((user) => {
          this.store.setActive(user.uid);
          this.playerStore.setActive(user.uid);
        }),
        first()
      )
      .subscribe();

    return true;
  }
}
