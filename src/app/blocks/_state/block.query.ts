// Angular
import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita/src';

// States
import { BlockStore, BlockState } from './block.store';

@Injectable({ providedIn: 'root' })
export class BlockQuery extends QueryEntity<BlockState> {
  constructor(protected override store: BlockStore) {
    super(store);
  }
}
