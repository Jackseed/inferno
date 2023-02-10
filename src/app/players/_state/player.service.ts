// Angular
import { Injectable } from '@angular/core';
// Firebase
import { Firestore } from 'firebase/firestore';
import {
  deleteFirestoreDoc,
  setFirestoreDoc,
  updateFirestoreDoc,
} from 'src/app/utils';
// States
import { createPlayer, Player } from './player.model';
import { Vector } from 'src/app/utils';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private db: Firestore) {}

  public async setplayer(): Promise<Player> {
    const player = createPlayer('blue');

    setFirestoreDoc(this.db, `players/${player.id}`, player);
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
