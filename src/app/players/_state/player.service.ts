// Angular
import { Injectable } from '@angular/core';
import { Vector } from 'src/app/utils';
// States

import { PlayerStore } from './player.store';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private store: PlayerStore) {}

  public setActive(id: string) {
    this.store.setActive(id);
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
