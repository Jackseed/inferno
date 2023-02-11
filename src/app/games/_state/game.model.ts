export interface Game {
  id: string;
  name: string;
}

export function createGame(
  id: string,
  name: string,
  params?: Partial<Game>
): Game {
  return {
    id,
    name,
  };
}
