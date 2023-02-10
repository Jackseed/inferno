// Angular
import { Injectable } from '@angular/core';

import { Auth, signInAnonymously } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { deleteDoc, updateDoc } from 'firebase/firestore';
import { createUser, AppUser } from './auth.model';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private store: AuthStore
  ) {}

  async anonymousLogin() {
    const user = (await signInAnonymously(this.auth)).user;

    if (user) {
      this.setUser(user.uid);
    }
    this.router.navigate(['']);
  }

  public async setUser(id: string): Promise<AppUser> {
    const user = createUser(id);
    const userDoc = doc(this.firestore, `users/${id}`);
    await setDoc(userDoc, user).catch((err) => console.log(err));
    return user;
  }

  public async updateUser(id: string, name: string) {
    const userDoc = doc(this.firestore, `users/${id}`);
    await updateDoc(userDoc, { name }).catch((err) => console.log(err));
  }

  public async deleteUser(id: string) {
    const userDoc = doc(this.firestore, `users/${id}`);
    await deleteDoc(userDoc).catch((err) => console.log(err));
  }

  public setActive(id: string) {
    this.store.setActive(id);
  }
}
