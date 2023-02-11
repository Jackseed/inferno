// Angular
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
// AngularFire
import { Auth, authState } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { syncCollection } from 'src/app/utils';
// Rxjs
import { first, tap } from 'rxjs/operators';
// States
import { AuthStore } from '../_state';
import { GameStore } from 'src/app/games/_state';

@Injectable({
  providedIn: 'root',
})
export class SyncActiveGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private store: AuthStore,
    private db: Firestore,
    private gameStore: GameStore
  ) {}
  canActivate() {
    authState(this.auth)
      .pipe(
        tap((user) => {
          this.store.setActive(user.uid);
          syncCollection(this.db, 'users', this.store);
          syncCollection(this.db, 'games', this.gameStore);
        }),
        first()
      )
      .subscribe();

    return true;
  }
}
