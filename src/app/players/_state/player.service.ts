// Angular
import { Injectable } from '@angular/core';
// Firebase
import { Firestore, arrayUnion } from '@angular/fire/firestore';
import {
  deleteFirestoreDoc,
  setFirestoreDoc,
  updateFirestoreDoc,
} from 'src/app/utils';
// States
import { createPlayer, Player } from './player.model';
import { Vector } from 'src/app/utils';
import { PlayerStore } from './player.store';
import { GameService } from 'src/app/games/_state';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(
    private db: Firestore,
    private store: PlayerStore,
    private gameService: GameService
  ) {}

  public async setPlayer(
    gameId: string,
    playerId: string,
    color: string
  ): Promise<Player> {
    const player = createPlayer(playerId, color);

    setFirestoreDoc(this.db, `games/${gameId}/players/${player.id}`, player);
    return player;
  }

  public addPlayer(gameId: string, playerId: string) {
    const playerIds = { playerIds: arrayUnion(playerId) };
    this.gameService.updateGame(gameId, playerIds);
    /*     const color = '#' + Math.floor(Math.random() * 8999999 + 100000).toString();
    console.log(color); */
    this.setPlayer(gameId, playerId, 'red');
  }

  public async updatePlayer(
    gameId: string,
    playerId: string,
    updatedValues: { position: Vector; direction: Vector }
  ) {
    updateFirestoreDoc(
      this.db,
      `games/${gameId}/players/${playerId}`,
      updatedValues
    );
  }

  public async deletePlayer(playerId: string) {
    deleteFirestoreDoc(this.db, `players/${playerId}`);
  }

  public setActive(id: string) {
    this.store.setActive(id);
  }

  public movePlayer(
    position: Vector,
    direction: Vector,
    velocity: number
  ): Vector {
    const newPosition = {
      x: direction.x * velocity + position.x,
      y: position.y + direction.y * velocity,
    };

    return newPosition;
  }
}
