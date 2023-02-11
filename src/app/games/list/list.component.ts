import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game, GameQuery } from '../_state';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  public gameList$: Observable<Game[]>;
  constructor(private query: GameQuery) {}

  ngOnInit(): void {
    this.gameList$ = this.query.selectAll();
    this.gameList$.subscribe(console.log);
  }
}
