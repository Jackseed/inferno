// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Firebase
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
// States
import { createUser, AppUser } from './auth.model';
import {
  deleteFirestoreDoc,
  setFirestoreDoc,
  updateFirestoreDoc,
} from 'src/app/utils';
import { PlayerService } from 'src/app/players/_state';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private db: Firestore,
    private auth: Auth,
    private playerService: PlayerService
  ) {}

  async anonymousLogin() {
    const user = (await signInAnonymously(this.auth)).user;

    if (user) {
      this.setUser(user.uid);
      this.playerService.setPlayer(user.uid);
      this.playerService.setActive(user.uid);
    }
    this.router.navigate(['']);
  }

  public async setUser(id: string): Promise<AppUser> {
    const user = createUser(id);
    setFirestoreDoc(this.db, `users/${id}`, user);
    return user;
  }

  public async updateUser(id: string, name: string) {
    updateFirestoreDoc(this.db, `users/${id}`, { name });
  }

  public async deleteUser(id: string) {
    deleteFirestoreDoc(this.db, `users/${id}`);
  }
}
