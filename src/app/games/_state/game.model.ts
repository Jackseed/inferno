export interface Game {
  id?: string;
  name: string;
  playerIds: string[];
}

export function createGame(
  name: string,
  playerIds: string[],
  params?: Partial<Game>
): Game {
  return {
    name,
    playerIds,
  };
}
