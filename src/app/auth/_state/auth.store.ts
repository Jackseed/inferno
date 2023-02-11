import { Injectable } from '@angular/core';
import {
  EntityState,
  EntityStore,
  StoreConfig,
  ActiveState,
} from '@datorama/akita/src';
import { AppUser } from './auth.model';

export interface AuthState
  extends EntityState<AppUser, string>,
    ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users' })
export class AuthStore extends EntityStore<AuthState> {
  constructor() {
    super();
  }
}
