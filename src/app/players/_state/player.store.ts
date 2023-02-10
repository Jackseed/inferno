import { Injectable } from '@angular/core';
import {
  EntityState,
  EntityStore,
  StoreConfig,
  ActiveState,
} from '@datorama/akita/src';
import { Player } from './player.model';

export interface PlayerState
  extends EntityState<Player, string>,
    ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'players' })
export class PlayerStore extends EntityStore<PlayerState> {
  constructor() {
    super();
  }
}
