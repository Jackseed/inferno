import { Injectable } from '@angular/core';
import { KeyPressed, Vector } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class ControllerInputService {
  constructor() {}

  public controllerInput(
    controllerIndex: number,
    keyPressed: KeyPressed,
    direction: Vector
  ) {
    if (controllerIndex === null) return direction;

    const gamepad = navigator.getGamepads()[controllerIndex];
    if (gamepad === null) return direction;

    let newDirection = direction;
    const buttons = gamepad.buttons;
    keyPressed.up = buttons[12].pressed;
    keyPressed.down = buttons[13].pressed;
    keyPressed.left = buttons[14].pressed;
    keyPressed.right = buttons[15].pressed;

    keyPressed.cross = buttons[0].pressed;
    keyPressed.triangle = buttons[3].pressed;
    keyPressed.square = buttons[2].pressed;
    keyPressed.circle = buttons[1].pressed;

    const stickDeadZone = 0.4;
    const leftAndRightValue = gamepad.axes[0];
    const upAndDownValue = gamepad.axes[1];

    if (leftAndRightValue >= stickDeadZone) {
      keyPressed.right = true;
    }
    if (leftAndRightValue <= -stickDeadZone) {
      keyPressed.left = true;
    }
    if (upAndDownValue >= stickDeadZone) {
      keyPressed.down = true;
    }
    if (upAndDownValue <= -stickDeadZone) {
      keyPressed.up = true;
    }

    if (
      keyPressed.left ||
      keyPressed.right ||
      keyPressed.up ||
      keyPressed.down
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
      return direction;
    }
    if (keyPressed.cross) {
      // if (
      //   keyPressed.circle &&
      //   cooldowns.dash.frame >= cooldowns.dash.cd * 60
      // ) {
      //   console.log(cooldowns.dash.frame);
      //   cooldowns.dash.frame = 0;
      //   dashing = true;
      // }
      //       if (keyPressed.square) {
      //         this.canMove = false;
      //         if (this.isAiming === false) {
      //           this.aimPoint = {
      //             x:
      //               this.playerX +
      //               this.direction.x * (this.playerWidthAndHeight + 10),
      //             y:
      //               this.playerY +
      //               this.direction.y * (this.playerWidthAndHeight + 10),
      //           };
      //           this.aimRange = 0;
      //           this.isAiming = true;
      //         }
      //         console.log('squarePressed');
      //         // aimingLine();
      //       } else {
      //         this.canMove = true;
      //         //  shoot();
      //         this.isAiming = false;
      //       }
      //       if (this.trianglePressed) {
      //         this.velocity = 1;
      //         this.shieldUp = true;
      //         this.shieldLength = 80;
      //       } else {
      //         this.velocity = 5;
      //         this.shieldUp = false;
      //         this.shieldLength = 60;
      //       }
    }
    return newDirection;
  }
}
