import { Injectable } from '@angular/core';
import {
  EntityState,
  EntityStore,
  StoreConfig,
  ActiveState,
} from '@datorama/akita/src';
import { Projectile } from './projectile.model';

export interface ProjectileState
  extends EntityState<Projectile, string>,
    ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'projectile' })
export class ProjectileStore extends EntityStore<ProjectileState> {
  constructor() {
    super();
  }
}
