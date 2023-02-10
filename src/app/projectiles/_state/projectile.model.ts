import { Vector } from "src/app/utils";

export interface Projectile {
  id: string;
  position: Vector;
  velocity: Vector;
  color: string;
  isDeflected: boolean;
  isUpdating: boolean;
}

export function createProjectile(
  position: Vector,
  velocity: Vector,
  color: string,
  params?: Partial<Projectile>
): Projectile {
  return {
    id: (Math.random() * 1000).toString().concat(Date.now().toString()),
    position,
    velocity,
    color,
    isDeflected: false,
    isUpdating: true,
  };
}
