// Angular
import { Injectable } from '@angular/core';
// States
import { BlockStore } from './block.store';

@Injectable({ providedIn: 'root' })
export class BlockService {
  constructor(private store: BlockStore) {}

  public setActive(id: string) {
    this.store.setActive(id);
  }
}
