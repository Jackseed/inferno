// Angular
import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita/src';

// States
import { GameStore, GameState } from './game.store';

@Injectable({ providedIn: 'root' })
export class GameQuery extends QueryEntity<GameState> {
  constructor(protected override store: GameStore) {
    super(store);
  }
}
