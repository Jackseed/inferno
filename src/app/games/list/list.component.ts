// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Rxjs
import { Observable } from 'rxjs';
// States
import { AuthQuery } from 'src/app/auth/_state';
import { PlayerService } from 'src/app/players/_state';
import { Game, GameQuery } from '../_state';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  public gameList$: Observable<Game[]>;
  constructor(
    private router: Router,
    private query: GameQuery,
    private authQuery: AuthQuery,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.gameList$ = this.query.selectAll();
  }

  public joinGame(gameId: string) {
    const playerId = this.authQuery.getActiveId();
    const game = this.query.getEntity(gameId);
    if (!game.playerIds.includes(playerId))
      this.playerService.addPlayer(game.id, playerId);
    this.router.navigate(['games', gameId]);
  }
}
