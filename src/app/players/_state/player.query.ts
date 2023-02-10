// Angular
import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita/src';

// States
import { PlayerStore, PlayerState } from './player.store';

@Injectable({ providedIn: 'root' })
export class PlayerQuery extends QueryEntity<PlayerState> {
  constructor(protected override store: PlayerStore) {
    super(store);
  }
}
