// Angular
import { Injectable } from '@angular/core';
// States
import { ProjectileStore } from './projectile.store';

@Injectable({ providedIn: 'root' })
export class ProjectileService {
  constructor(private store: ProjectileStore) {}

  public setActive(id: string) {
    this.store.setActive(id);
  }



}
