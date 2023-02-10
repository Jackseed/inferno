export interface Projectile {
  id: string;
}

export function createProjectile(
  id: string,
  params?: Partial<Projectile>
): Projectile {
  return {
    id,
  };
}
