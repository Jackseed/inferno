// Angular
import { Injectable } from '@angular/core';
// States
import { PlayerStore } from './player.store';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private store: PlayerStore) {}

  public setActive(id: string) {
    this.store.setActive(id);
  }
}
