
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import { Firestore } from '@angular/fire/firestore';
import { AuthStore } from '../auth/_state';
import { syncCollection } from '../utils';


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


 
constructor(private db: Firestore, private authStore: AuthStore) {}

 ngOnInit(): void {
    syncCollection(this.db, 'users', this.authStore);}
    
  ngAfterViewInit(): void {
    this.ctx = this.gameArea!.nativeElement.getContext('2d')!;
    console.log(this.ctx);

    this.gameLoop();
    this.drawPlayer();
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

  private controllerInput() {
    if (this.controllerIndex !== null) {
      const gamepad = navigator.getGamepads()[this.controllerIndex];
      if (gamepad !== null) {
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

        if (Math.abs(upAndDownValue * leftAndRightValue) <= 0.5) {
          this.velocity = 5;
        } else this.velocity = (Math.sqrt(2) * 5) / 2;

        if (
          this.leftPressed ||
          this.rightPressed ||
          this.upPressed ||
          this.downPressed
        ) {
          this.direction = {
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
        }
        if (this.crossPressed) {
        }
        if (
          this.circlePressed &&
          this.cooldowns.dash.frame >= this.cooldowns.dash.cd*60
        ) {
          console.log(this.cooldowns.dash.frame)
          this.cooldowns.dash.frame = 0;
          this.dashing = true;
        }

        if (this.squarePressed) {
          this.canMove = false;
          if (this.isAiming === false) {
            this.aimPoint = {
              x:
                this.playerX +
                this.direction.x * (this.playerWidthAndHeight + 10),
              y:
                this.playerY +
                this.direction.y * (this.playerWidthAndHeight + 10),
            };
            this.aimRange = 0;
            this.isAiming = true;
          }
          console.log('squarePressed');

          // aimingLine();
        } else {
          this.canMove = true;
          //  shoot();
          this.isAiming = false;
        }

        if (this.trianglePressed) {
          this.velocity = 1;
          this.shieldUp = true;
          this.shieldLength = 80;
        } else {
          this.velocity = 5;
          this.shieldUp = false;
          this.shieldLength = 60;
        }
      }
    }
  }

  private movePlayer() {
    if (
      this.canMove &&
      (this.upPressed ||
        this.downPressed ||
        this.rightPressed ||
        this.leftPressed)
    ) {
      this.playerX += this.direction.x * this.velocity;
      this.playerY += this.direction.y * this.velocity;
    }
    if (this.dashing && this.cooldowns.dash.frame <= 5) {
      this.playerX += this.direction.x * 30;
      this.playerY += this.direction.y * 30;
    }
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
      Math.PI * 2
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

    this.controllerInput();
    this.drawPlayer();
    this.drawShield();
    this.movePlayer();
    this.cooldowns.dash.frame += 1;
  }

}
