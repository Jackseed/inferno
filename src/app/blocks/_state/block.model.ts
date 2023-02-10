export interface Block {
  id: string;
}

export function createBlock(
  id: string,
  params?: Partial<Block>
): Block {
  return {
    id,
  };
}
