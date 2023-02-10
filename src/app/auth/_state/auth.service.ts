// Angular
import { Injectable } from '@angular/core';

import { Auth, signInAnonymously, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { createUser, AppUser } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {}

  async anonymousLogin() {
    const user = (await signInAnonymously(this.auth)).user;

    if (user) {
      this.setUser(user.uid);
    }
    this.router.navigate(['']);
  }

  private async setUser(uid: string): Promise<AppUser> {
    const user = createUser(uid);
    const userDoc = doc(this.firestore, `users/${uid}`);
    await setDoc(userDoc, user).catch((err) => console.log(err));
    return user;
  }
}
