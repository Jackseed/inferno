import { Injectable } from '@angular/core';
import {
  EntityState,
  EntityStore,
  StoreConfig,
  ActiveState,
} from '@datorama/akita/src';
import { Block } from './block.model';

export interface BlockState
  extends EntityState<Block, string>,
    ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'blocks' })
export class BlockStore extends EntityStore<BlockState> {
  constructor() {
    super();
  }
}
