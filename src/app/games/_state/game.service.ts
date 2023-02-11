// Angular
import { Injectable } from '@angular/core';
// Firebase
import { Firestore } from '@angular/fire/firestore';
import { createId, setFirestoreDoc } from 'src/app/utils';
// States
import { GameStore } from './game.store';
import { createGame, Game } from './game.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private store: GameStore, private db: Firestore) {}

  public async setGame(): Promise<Game> {
    const id = createId(this.db);
    const game = createGame(id);
    setFirestoreDoc(this.db, `games/${game.id}`, game);
    return game;
  }

  public setActive(id: string) {
    this.store.setActive(id);
  }
}
