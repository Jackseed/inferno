// Angular
import { Injectable } from '@angular/core';
// Firebase
import { Firestore } from '@angular/fire/firestore';
import {
  deleteFirestoreDoc,
  setFirestoreDoc,
  updateFirestoreDoc,
} from 'src/app/utils';
// States
import { createPlayer, Player } from './player.model';
import { Vector } from 'src/app/utils';
import { PlayerStore } from './player.store';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private db: Firestore, private store: PlayerStore) {}

  public async setPlayer(gameId: string, id: string): Promise<Player> {
    const player = createPlayer(id, 'blue');

    setFirestoreDoc(this.db, `games/${gameId}/players/${player.id}`, player);
    return player;
  }

  public async updatePlayer(
    id: string,
    updatedValues: { position: Vector; direction: Vector }
  ) {
    updateFirestoreDoc(this.db, `players/${id}`, updatedValues);
  }

  public async deletePlayer(id: string) {
    deleteFirestoreDoc(this.db, `players/${id}`);
  }

  public setActive(id: string) {
    this.store.setActive(id);
  }

  public movePlayer(
    position: Vector,
    direction: Vector,
    velocity: number
  ): Vector {
    const newPosition = {
      x: direction.x * velocity + position.x,
      y: position.y + direction.y * velocity,
    };

    return newPosition;
  }
}
