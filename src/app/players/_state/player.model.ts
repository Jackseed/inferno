import { Vector } from "src/app/utils";


export interface Player {
  id: string;
  position: Vector;
  velocity: Vector;
  color: string;

  //TODO -> add state, player controller, sprite source
}

export function createPlayer(
  position: Vector,
  velocity: Vector,
  color: string,
  params?: Partial<Player>
): Player {
  return {
    id: (Math.random() * 1000).toString().concat(Date.now().toString()),
    position,
    velocity,
    color,
  };
}
