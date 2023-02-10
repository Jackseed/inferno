// Angular
import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita/src';

// States
import { ProjectileStore, ProjectileState } from './projectile.store';

@Injectable({ providedIn: 'root' })
export class ProjectileQuery extends QueryEntity<ProjectileState> {
  constructor(protected override store: ProjectileStore) {
    super(store);
  }
}
