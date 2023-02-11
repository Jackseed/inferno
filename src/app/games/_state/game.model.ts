export interface Game {
  name: string;
}

export function createGame(name: string, params?: Partial<Game>): Game {
  return {
    name,
  };
}
