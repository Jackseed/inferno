// Angular
import { Injectable } from '@angular/core';
// Firebase
import { FieldValue, Firestore } from '@angular/fire/firestore';
import { addFirestoreDoc, updateFirestoreDoc } from 'src/app/utils';
// States
import { GameStore, createGame, Game } from '../_state';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private store: GameStore, private db: Firestore) {}

  public async addGame(name: string, playerId: string): Promise<string> {
    const game = createGame(name, [playerId]);
    const { id } = await addFirestoreDoc(this.db, 'games', game);
    await updateFirestoreDoc(this.db, `games/${id}`, { id });
    return id;
  }

  public async updateGame(
    gameId: string,
    updatedValues: Partial<Game> | { playerIds: FieldValue }
  ) {
    updateFirestoreDoc(this.db, `games/${gameId}`, updatedValues);
  }

  public setActive(id: string) {
    this.store.setActive(id);
  }
}
