import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

const canvas = <HTMLCanvasElement>document.getElementById('myChart');
const ctx = canvas.getContext('2d')!;

let playerWidthAndHeight = 0;
let playerX = 300;
let playerY = 500;
let playerColor = 'orange';
let velocity = 0;

let controllerIndex = 0;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

let circlePressed = false;
let crossPressed = false;
let trianglePressed = false;
let squarePressed = false;

let direction = { x: 0, y: -1 };

let cooldowns = {
  dash: { frame: 0, cd: 3 },
  projectile: { frame: 0, cd: 3 },
};

let canMove = true;

let dashing = false;

let shieldUp = false;
let shieldColor = 'gray';
let shieldCenterPosition = {
  x: playerX + direction.x * playerWidthAndHeight * 1.5,
  y: playerY + direction.y * playerWidthAndHeight * 1.5,
};
let leftShieldPosition;
let rightShieldPosition;
let shieldDirection = { x: -1, y: 0 };
let shieldLength = 70;

// Arc

let maxRange = 320;
let aimSpeed = 15;
let isAiming = false;
let aimRange = 0;
let aim0 = {
  x: playerX + direction.x * (playerWidthAndHeight + 10),
  y: playerY + direction.y * (playerWidthAndHeight + 10),
};

let aimPoint = aim0;

function extendAim() {
  if (isAiming) {
    aim0 = {
      x: playerX + direction.x * (playerWidthAndHeight + 10),
      y: playerY + direction.y * (playerWidthAndHeight + 10),
    };
    aimPoint = {
      x: aim0.x + aimRange * direction.x * aimSpeed,
      y: aim0.y + aimRange * direction.y * aimSpeed,
    };
    if (aimRange <= maxRange / aimSpeed) aimRange++;
  }
}

function aimingLine() {
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.moveTo(
    playerX + direction.x * (playerWidthAndHeight + 10),
    playerY + direction.y * (playerWidthAndHeight + 10)
  );
  ctx.lineTo(aimPoint.x, aimPoint.y);
  ctx.strokeStyle = 'grey';
  ctx.stroke();
  ctx.closePath();
}

function shoot() {
  let arrowSpeed = 10;
  let arrowDirection = addVectors(aimPoint, vectorOpposite(aim0));
  let arrowDirectionNormalized = normalizeVector(arrowDirection);
  let velocity = multiplyVectors(arrowSpeed, arrowDirectionNormalized);

  let arrow = new Projectiles({
    x: aim0.x,
    y: aim0.y,
    velocityX: velocity.x,
    velocityY: velocity.y,
  });
}

function dash() {
  if (dashing && cooldowns.dash.frame <= 5) {
    playerX += direction.x * 30;
    playerY += direction.y * 30;
  }
}

// Opérateurs de vecteurs

function addVectors(v1: number{}, v2: Object) {
  const sum = {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
  return sum;
}

function normalizeVector(v) {
  const length = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
  const normalisedVect = {
    x: v.x / length,
    y: v.y / length,
  };
  return normalisedVect;
}

function multiplyVectors(k, v1) {
  const product = {
    x: k * v1.x,
    y: k * v1.y,
  };
  return product;
}

function vectorOpposite(v) {
  const opposite = {
    x: -v.x,
    y: -v.y,
  };
  return opposite;
}

function changeVelocityOnImpact(norm, velocity) {
  const dotProduct = -velocity.x * norm.x - velocity.y * norm.y;
  const velocityProjection = multiplyVectors(dotProduct, norm);
  const lateralVector = addVectors(velocity, velocityProjection);
  const newVelocity = addVectors(velocityProjection, lateralVector);

  return newVelocity;
}

function distanceToShield(objectX, objectY) {
  let shieldPoints = [];

  let vect = { x: 0, y: 0 };
  let portionLength = shieldLength / 10;

  if (shieldUp) {
    vect = { x: direction.y, y: -direction.x };
  } else {
    vect = { x: -direction.x, y: -direction.y };
  }
  for (i = 1; i <= 6; i++) {
    let point1 = {
      x: shieldCenterPosition.x + vect.x * portionLength * i,
      y: shieldCenterPosition.y + vect.y * portionLength * i,
    };
    shieldPoints.push(point1);
  }
  for (i = 1; i <= 4; i++) {
    let point2 = {
      x: shieldCenterPosition.x - vect.x * portionLength * i,
      y: shieldCenterPosition.y - vect.y * portionLength * i,
    };

    shieldPoints.push(point2);
  }

  let distances = [];
  shieldPoints.forEach((point) => {
    distances.push(
      Math.sqrt(Math.pow(objectX - point.x, 2) + Math.pow(objectY - point.y, 2))
    );
  });
  let distance = Math.min(...distances);

  return distance;
}

function setupCanvas() {
  canvas.width = 1024;
  canvas.height = 576;

  playerWidthAndHeight = 30;
  playerX = 300;
  playerY = 500;
  playerColor = 'orange';
  velocity = 0.01;
}

setupCanvas();

window.addEventListener('gamepadconnected', (event) => {
  controllerIndex = event.gamepad.index;
  console.log('connected');
});
window.addEventListener('gamepaddisconnected ', (event) => {
  controllerIndex = null;
  console.log('disconnected');
});
window.addEventListener('resize', setupCanvas);

window.addEventListener('keyup', ({ keyCode }) => {});

function clearScreen() {
  ctx.fillStyle = '#333331';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function movePlayer() {
  if (canMove && (upPressed || downPressed || rightPressed || leftPressed)) {
    playerX += direction.x * velocity;
    playerY += direction.y * velocity;
  }
}

class Projectiles {
  constructor({ x, y, velocityX, velocityY }) {
    this.position = {
      x,
      y,
    };
    this.velocity = {
      x: velocityX,
      y: velocityY,
    };
    this.color = 'blue';
    this.deflected = false;
    this.stopUpdating = false;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, 6, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    // console.log(this.position.x)
  }

  update() {
    if (!this.stopUpdating) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // Detection de la collision
      if (
        distanceToShield(this.position.x, this.position.y) <= 10 &&
        this.deflected === false
      ) {
        this.deflected = true;
        this.color = 'red';

        this.velocity = changeVelocityOnImpact(shieldDirection, this.velocity);
      }

      if (this.deflected === true) {
        if (
          Math.max(Math.abs(this.velocity.x), Math.abs(this.velocity.y)) <= 1 ||
          this.frame >= 40
        ) {
          this.stopUpdating = true;
        }
      }

      this.frame++;
      this.draw();
    }
  }
}

let projectiles = [];

function updatePlayer() {
  movePlayer();
}

function drawShield() {
  if (shieldUp) {
    shieldDirection = direction;
    orthVect = {
      x: direction.y,
      y: -direction.x,
    };
  } else {
    shieldDirection = {
      x: +direction.y,
      y: -direction.x,
    };
    orthVect = {
      x: -direction.x,
      y: -direction.y,
    };
  }

  shieldCenterPosition = {
    x: playerX + shieldDirection.x * 1.5 * playerWidthAndHeight,
    y: playerY + shieldDirection.y * 1.5 * playerWidthAndHeight,
  };
  leftShieldPosition = {
    x: shieldCenterPosition.x + orthVect.x * shieldLength * 0.6,
    y: shieldCenterPosition.y + orthVect.y * shieldLength * 0.6,
  };

  rightShieldPosition = {
    x: shieldCenterPosition.x - orthVect.x * shieldLength * 0.4,
    y: shieldCenterPosition.y - orthVect.y * shieldLength * 0.4,
  };

  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.moveTo(leftShieldPosition.x, leftShieldPosition.y);
  ctx.lineTo(rightShieldPosition.x, rightShieldPosition.y);
  ctx.strokeStyle = shieldColor;
  ctx.stroke();
  ctx.closePath();

  // dessin des vecteurs //
  // Vecteur normal
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(shieldCenterPosition.x, shieldCenterPosition.y);
  ctx.lineTo(
    shieldCenterPosition.x + shieldDirection.x * 40,
    shieldCenterPosition.y + shieldDirection.y * 40
  );
  ctx.strokeStyle = 'green';
  ctx.stroke();
  ctx.closePath();

  // Vecteur parallèle
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(shieldCenterPosition.x, shieldCenterPosition.y);
  ctx.lineTo(
    shieldCenterPosition.x + orthVect.x * 40,
    shieldCenterPosition.y + orthVect.y * 40
  );
  ctx.strokeStyle = 'red';
  ctx.stroke();
  ctx.closePath();
}

function drawPlayer() {
  ctx.fillStyle = playerColor;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath();
  ctx.arc(playerX, playerY, playerWidthAndHeight, 0, Math.PI * 2, false);
  ctx.strokeStyle = playerColor;
  ctx.stroke();
  ctx.fillStyle = playerColor;
  ctx.fill();
  ctx.closePath();
}

function controllerInput() {
  if (controllerIndex !== null) {
    const gamepad = navigator.getGamepads()[controllerIndex];
    const buttons = gamepad.buttons;
    upPressed = buttons[12].pressed;
    downPressed = buttons[13].pressed;
    leftPressed = buttons[14].pressed;
    rightPressed = buttons[15].pressed;

    crossPressed = buttons[0].pressed;
    trianglePressed = buttons[3].pressed;
    squarePressed = buttons[2].pressed;
    circlePressed = buttons[1].pressed;

    const stickDeadZone = 0.4;
    const leftAndRightValue = gamepad.axes[0];
    const upAndDownValue = gamepad.axes[1];

    if (leftAndRightValue >= stickDeadZone) {
      rightPressed = true;
    }
    if (leftAndRightValue <= -stickDeadZone) {
      leftPressed = true;
    }
    if (upAndDownValue >= stickDeadZone) {
      downPressed = true;
    }
    if (upAndDownValue <= -stickDeadZone) {
      upPressed = true;
    }

    if (Math.abs(upAndDownValue * leftAndRightValue) <= 0.5) {
      velocity = 5;
    } else velocity = (Math.sqrt(2) * 5) / 2;

    if (leftPressed || rightPressed || upPressed || downPressed) {
      direction = {
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
    if (crossPressed) {
    }
    if (circlePressed && cooldowns.dash.frame >= cooldowns.dash.cd) {
      cooldowns.dash.frame = 0;
      dashing = true;
    }

    if (squarePressed) {
      canMove = false;
      if (isAiming === false) {
        aimPoint = {
          x: playerX + direction.x * (playerWidthAndHeight + 10),
          y: playerY + direction.y * (playerWidthAndHeight + 10),
        };
        aimRange = 0;
        isAiming = true;
      }
      aimingLine();
    } else {
      canMove = true;
      shoot();
      isAiming = false;
    }

    if (trianglePressed) {
      velocity = 1;
      shieldUp = true;
      shieldLength = 80;
    } else {
      velocity = 5;
      shieldUp = false;
      shieldLength = 60;
    }
    if (direction.y < 0) playerAngle = Math.acos(direction.x);
    if (direction.y >= 0) playerAngle = Math.PI * 2 - Math.acos(direction.x);
  }
}
function gameLoop() {
  clearScreen();
  requestAnimationFrame(gameLoop);
  drawPlayer();
  drawShield();
  projectiles.forEach((projectile) => projectile.update());
  updatePlayer();
  controllerInput();
  extendAim();
  Object.keys(cooldowns).forEach((key) => (cooldowns[key].frame += 1));
  projectiles.push(
    new Projectiles({
      x: 512,
      y: 5,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: 3,
    })
  );
  dash();
}

gameLoop();
