export interface Player {
  id: string;
}

export function createPlayer(id: string, params?: Partial<Player>): Player {
  return {
    id,
  };
}
