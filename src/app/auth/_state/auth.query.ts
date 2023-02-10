// Angular
import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// States
import { AuthStore, AuthState } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends QueryEntity<AuthState> {
  constructor(protected override store: AuthStore) {
    super(store);
  }
}
