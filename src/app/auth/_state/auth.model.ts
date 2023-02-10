export interface AppUser {
  id: string;
  name?: string;
}

export function createUser(id: string, params?: Partial<AppUser>): AppUser {
  return {
    id,
  };
}
