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

  public playerWidthAndHeight = 20;
  public playerX = 300;
  public playerY = 200;
  public playerColor = 'orange';
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
  public leftShieldPosition = { x: 0, y: 0 };
  public rightShieldPosition = { x: 0, y: 0 };
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
    this.ctx = this.gameArea!.nativeElement.getContext('2d')!;
    console.log(this.ctx);

    this.gameLoop();
    this.drawPlayer();
    this.drawShield()

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
    if (this.shieldUp) {
      this.shieldDirection = this.direction;
      this.orthVect = {
        x: this.direction.y,
        y: -this.direction.x,
      };
    } else {
      this.shieldDirection = {
        x: +this.direction.y,
        y: -this.direction.x,
      };
      this.orthVect = {
        x: -this.direction.x,
        y: -this.direction.y,
      };
    }

    this.shieldCenterPosition = {
      x:
        this.playerX + this.shieldDirection.x * 1.5 * this.playerWidthAndHeight,
      y:
        this.playerY + this.shieldDirection.y * 1.5 * this.playerWidthAndHeight,
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

  private clearScreen() {
    this.ctx.fillStyle = '#333331';
    this.ctx.fillRect(0, 0, 800, 450);
  }

  private drawPlayer() {
    this.ctx.fillStyle = this.playerColor;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.beginPath();
    this.ctx.arc(
      this.playerX,
      this.playerY,
      this.playerWidthAndHeight,
      0,
      Math.PI * 2,
    );
    this.ctx.strokeStyle = this.playerColor;
    this.ctx.stroke();
    this.ctx.fillStyle = this.playerColor;
    this.ctx.fill();
    this.ctx.closePath();

    console.log(this.playerX, this.playerY, this.playerWidthAndHeight);
  }


  private gameLoop() {
     this.clearScreen();
     requestAnimationFrame(this.gameLoop.bind(this));

     this.drawPlayer();
  }
}
