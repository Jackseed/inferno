// Angular
import { Injectable } from '@angular/core';
// Firebase
import { Firestore } from '@angular/fire/firestore';
import { addFirestoreDoc } from 'src/app/utils';
// States
import { GameStore, createGame } from '../_state';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private store: GameStore, private db: Firestore) {}

  public async addGame(name: string): Promise<string> {
    const game = createGame(name);
    const gameDoc = await addFirestoreDoc(this.db, 'games', game);
    return gameDoc.id;
  }

  public setActive(id: string) {
    this.store.setActive(id);
  }
}
