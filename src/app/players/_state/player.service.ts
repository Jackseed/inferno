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
import { Vector } from 'src/app/utils';

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

  public movePlayer(
    canMove: boolean,
    upPressed: boolean,
    rightPressed: boolean,
    leftPressed: boolean,
    downPressed: boolean,
    position: Vector,
    direction: Vector,
    velocity: number
  ) {
    if (canMove && (upPressed || downPressed || rightPressed || leftPressed)) {
      const newPosition = {
        x: (position.x += direction.x * velocity),
        y: (position.y += direction.y * velocity),
      };

      return newPosition;
    } else return position;
    // if (dashing && cooldowns.dash.frame <= 5) {
    //   position.x += direction.x * 30;
    //   position.y += direction.y * 30;
    // }
  }
}
