// Angular
import { Injectable } from '@angular/core';
// Firebase
import { Firestore } from 'firebase/firestore';
import {
  deleteFirestoreDoc,
  setFirestoreDoc,
  updateFirestoreDoc,
} from 'src/app/utils';
import { createPlayer, Player } from './player.model';
// States
import { PlayerStore } from './player.store';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private db: Firestore, private store: PlayerStore) {}

  public async setplayer(id: string): Promise<Player> {
    const player = createPlayer(id);
    setFirestoreDoc(this.db, `players/${id}`, player);
    return player;
  }

  public async updatePlayer(id: string, name: string) {
    updateFirestoreDoc(this.db, `players/${id}`, { name });
  }

  public async deletePlayer(id: string) {
    deleteFirestoreDoc(this.db, `players/${id}`);
  }
}
