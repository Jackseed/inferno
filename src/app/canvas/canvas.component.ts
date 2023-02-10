import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('gameArea') gameArea: ElementRef | undefined;

  private ctx: CanvasRenderingContext2D | undefined;

  public playerWidthAndHeight = 0;
  public playerX = 300;
  public playerY = 500;
  public playerColor = 'orange';
  public velocity = 0;
  public playerAngle: number = 0;

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
    dash: { frame: 0, cd: 3 },
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
  public leftShieldPosition = 0;
  public rightShieldPosition = 0;
  public shieldDirection = { x: -1, y: 0 };
  public shieldLength = 70;
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

  constructor() {}

  ngAfterViewInit(): void {
    console.log(this.gameArea);
    this.ctx = this.gameArea!.nativeElement.getContext('2d')!;

    this.setupCanvas();
  }

  private setupCanvas() {

    this.playerWidthAndHeight = 30;
    this.playerX = 300;
    this.playerY = 500;
    this.playerColor = 'orange';
    this.velocity = 0.01;
  }
}
