// Angular
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// AngularFire
import { Firestore, Unsubscribe } from '@angular/fire/firestore';
import { syncCollection } from '../utils';
// Rxjs
import { takeWhile, tap } from 'rxjs/operators';
// States
import { PlayerStore, PlayerQuery, PlayerService } from '../players/_state';
import { AuthQuery } from '../auth/_state';
import { BlockStore } from 'src/app/blocks/_state';
import { ProjectileStore } from 'src/app/projectiles/_state';
import { GameQuery, GameService } from '../games/_state';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('gameArea') gameArea: ElementRef | undefined;
  private playerSyncSub: Unsubscribe;
  private blockSyncSub: Unsubscribe;
  private projectileSyncSub: Unsubscribe;

  private ctx: CanvasRenderingContext2D | undefined;

  public playerWidthAndHeight = 20;
  public playerX = 300;
  public playerY = 200;
  public velocity = 0;

  public controllerIndex = 0;
  public leftPressed = false;
  public rightPressed = false;
  public upPressed = false;
  public downPressed = false;

  public circlePressed = false;
  public crossPressed = false;
  public trianglePressed = false;
  public squarePressed = false;

  public direction = { x: 0, y: -1 };

  public cooldowns = {
    dash: { frame: 0, cd: 2 },
    projectile: { frame: 0, cd: 3 },
  };

  public canMove = true;

  public dashing = false;

  public shieldUp = false;
  public shieldColor = 'gray';
  public shieldCenterPosition = {
    x: this.playerX + this.direction.x * this.playerWidthAndHeight * 1.5,
    y: this.playerY + this.direction.y * this.playerWidthAndHeight * 1.5,
  };
  public leftShieldPosition = { x: 0, y: 0 };
  public rightShieldPosition = { x: 0, y: 0 };
  public shieldDirection = { x: -1, y: 0 };
  public shieldLength = 60;
  public orthVect: { x: number; y: number } = { x: 0, y: 0 };

  // Arc

  public maxRange = 320;
  public aimSpeed = 15;
  public isAiming = false;
  public aimRange = 0;
  public aim0 = {
    x: this.playerX + this.direction.x * (this.playerWidthAndHeight + 10),
    y: this.playerY + this.direction.y * (this.playerWidthAndHeight + 10),
  };

  public aimPoint = this.aim0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: Firestore,
    private authQuery: AuthQuery,
    private gameQuery: GameQuery,
    private gameService: GameService,
    private playerStore: PlayerStore,
    private playerQuery: PlayerQuery,
    private playerService: PlayerService,
    private blockStore: BlockStore,
    private projectileStore: ProjectileStore
  ) {}

  ngOnInit(): void {
    const gameId = this.activatedRoute.snapshot.paramMap.get('id');
    this.gameService.setActive(gameId);
    this.authQuery
      .selectActiveId()
      .pipe(
        tap((id) => {
          if (id) this.playerService.setActive(id);
        }),
        takeWhile((id) => !!!id)
      )
      .subscribe();
    this.playerSyncSub = syncCollection(
      this.db,
      `games/${gameId}/players`,
      this.playerStore
    );
    this.blockSyncSub = syncCollection(this.db, 'blocks', this.blockStore);
    this.projectileSyncSub = syncCollection(
      this.db,
      'projectiles',
      this.projectileStore
    );
  }

  ngAfterViewInit(): void {
    this.ctx = this.gameArea!.nativeElement.getContext('2d')!;

    this.gameLoop();
    this.drawPlayers();
    this.drawShield();

    window.addEventListener('gamepadconnected', (event) => {
      this.controllerIndex = event.gamepad.index;
      console.log('connected');
    });
    window.addEventListener('gamepaddisconnected ', (event) => {
      this.controllerIndex = 0;
      console.log('disconnected');
    });

    window.addEventListener('keyup', ({ keyCode }) => {});
  }

  private drawShield() {
    const activePlayer = this.playerQuery.getActive();
    if (this.shieldUp) {
      this.shieldDirection = activePlayer.direction;
      this.orthVect = {
        x: this.shieldDirection.y,
        y: -this.shieldDirection.x,
      };
    } else {
      this.shieldDirection = {
        x: +activePlayer.direction.y,
        y: -activePlayer.direction.x,
      };
      this.orthVect = {
        x: -activePlayer.direction.x,
        y: -activePlayer.direction.y,
      };
    }

    this.shieldCenterPosition = {
      x:
        activePlayer.position.x +
        this.shieldDirection.x * 1.5 * this.playerWidthAndHeight,
      y:
        activePlayer.position.y +
        this.shieldDirection.y * 1.5 * this.playerWidthAndHeight,
    };
    this.leftShieldPosition = {
      x:
        this.shieldCenterPosition.x + this.orthVect.x * this.shieldLength * 0.6,
      y:
        this.shieldCenterPosition.y + this.orthVect.y * this.shieldLength * 0.6,
    };

    this.rightShieldPosition = {
      x:
        this.shieldCenterPosition.x - this.orthVect.x * this.shieldLength * 0.4,
      y:
        this.shieldCenterPosition.y - this.orthVect.y * this.shieldLength * 0.4,
    };
   

    this.ctx.beginPath();
    this.ctx.lineWidth = 10;
    this.ctx.moveTo(this.leftShieldPosition.x, this.leftShieldPosition.y);
    this.ctx.lineTo(this.rightShieldPosition.x, this.rightShieldPosition.y);
    this.ctx.strokeStyle = this.shieldColor;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  private controllerInput() {
    if (this.controllerIndex === null) return null;
    const gamepad = navigator.getGamepads()[this.controllerIndex];
    if (gamepad === null) return null;
    let newDirection = this.direction;
    const buttons = gamepad.buttons;
    this.upPressed = buttons[12].pressed;
    this.downPressed = buttons[13].pressed;
    this.leftPressed = buttons[14].pressed;
    this.rightPressed = buttons[15].pressed;

    this.crossPressed = buttons[0].pressed;
    this.trianglePressed = buttons[3].pressed;
    this.squarePressed = buttons[2].pressed;
    this.circlePressed = buttons[1].pressed;

    const stickDeadZone = 0.4;
    const leftAndRightValue = gamepad.axes[0];
    const upAndDownValue = gamepad.axes[1];

    if (leftAndRightValue >= stickDeadZone) {
      this.rightPressed = true;
    }
    if (leftAndRightValue <= -stickDeadZone) {
      this.leftPressed = true;
    }
    if (upAndDownValue >= stickDeadZone) {
      this.downPressed = true;
    }
    if (upAndDownValue <= -stickDeadZone) {
      this.upPressed = true;
    }

    if (
      this.leftPressed ||
      this.rightPressed ||
      this.upPressed ||
      this.downPressed
    ) {
      newDirection = {
        x:
          leftAndRightValue /
          Math.sqrt(
            Math.pow(leftAndRightValue, 2) + Math.pow(upAndDownValue, 2)
          ),
        y:
          upAndDownValue /
          Math.sqrt(
            Math.pow(leftAndRightValue, 2) + Math.pow(upAndDownValue, 2)
          ),
      };
      return newDirection;
    }
    return null;
  }

  private clearScreen() {
    this.ctx.fillStyle = '#333331';
    this.ctx.fillRect(0, 0, 800, 450);
  }

  private drawPlayers() {
    const players = this.playerQuery.getAll();
    for (const player of players) {
      if (!!!player) return;
      this.ctx.fillStyle = player.color;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.beginPath();
      this.ctx.arc(
        player.position.x,
        player.position.y,
        this.playerWidthAndHeight,
        0,
        Math.PI * 2
      );
      this.ctx.strokeStyle = player.color;
      this.ctx.stroke();
      this.ctx.fillStyle = player.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  private gameLoop() {
    const activePlayer = this.playerQuery.getActive();
    const gameId = this.gameQuery.getActiveId();
    this.clearScreen();
    requestAnimationFrame(this.gameLoop.bind(this));

    const newDirection = this.controllerInput();
    this.drawPlayers();
    this.drawShield();
    if (!!newDirection && !!activePlayer) {
      const newPosition = this.playerService.movePlayer(
        activePlayer.position,
        activePlayer.direction,
        activePlayer.velocity
      );
      this.playerService.updatePlayer(gameId, activePlayer.id, {
        position: newPosition,
        direction: newDirection,
      });
    }
  }

  ngOnDestroy(): void {
    this.playerSyncSub();
    this.blockSyncSub();
    this.projectileSyncSub();
  }
}
