// Angular
import { Injectable } from '@angular/core';
// States
import { GameStore } from './game.store';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private store: GameStore) {}

  public setActive(id: string) {
    this.store.setActive(id);
  }
}
