// Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// States
import { GameService } from '../_state';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @ViewChild('gameNameInput') gameNameInput: ElementRef;
  public gameName: string = '';
  public gameId: string;
  constructor(private router: Router, private service: GameService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.gameNameInput?.nativeElement.focus();
  }

  public async createGame() {
    if (!this.gameName) return;
    this.service
      .addGame(this.gameName)
      .then((id: string) => {
        this.router.navigate(['games', id]);
      })
      .catch((error: any) => console.log('Game creation failed: ', error));
  }
}
