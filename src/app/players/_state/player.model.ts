import { Vector } from 'src/app/utils';

export interface Player {
  id: string;
  position: Vector;
  velocity: number;
  color: string;

  //TODO -> add state, player controller, sprite source
}

export function createPlayer(
  id: string,
  color: string,
  params?: Partial<Player>
): Player {
  return {
    id,
    position: { x: 150, y: 150 },
    velocity: 5,
    color,
  };
}
