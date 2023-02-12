// Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// States
import { GameService } from '../_state';
import { AuthQuery } from 'src/app/auth/_state';
import { PlayerService } from 'src/app/players/_state';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @ViewChild('gameNameInput') gameNameInput: ElementRef;
  public gameName: string = '';
  public gameId: string;
  constructor(
    private router: Router,
    private service: GameService,
    private authQuery: AuthQuery,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.gameNameInput?.nativeElement.focus();
  }

  public async createGame() {
    if (!this.gameName) return;
    const userId = this.authQuery.getActiveId();
    this.service
      .addGame(this.gameName, userId)
      .then(async (gameId: string) => {
        await this.playerService.setPlayer(gameId, userId, 'blue');
        this.router.navigate(['games', gameId]);
      })
      .catch((error: any) => console.log('Game creation failed: ', error));
  }
}
