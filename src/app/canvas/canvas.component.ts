import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthStore } from '../auth/_state';
import { syncCollection } from '../utils';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  public canvas = <HTMLCanvasElement>document.getElementById('gameArea');

  constructor(private db: Firestore, private authStore: AuthStore) {}

  ngOnInit(): void {
    syncCollection(this.db, 'users', this.authStore);
  }
}
