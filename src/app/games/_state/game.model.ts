export interface Game {
  id: string;
}

export function createGame(
  id: string,
  params?: Partial<Game>
): Game {
  return {
    id,
  };
}
