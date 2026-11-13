import "server-only";
import { getUserFromDB } from "./db";

export type UserDTO = {
  id: string;
  name: string;
  createdAt: string;
};

// Return only safe, public fields
export function getUserDTO(userId: string): UserDTO {
  const user = getUserFromDB(userId);

  // Only return fields that are safe to expose
  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt,
  };
}
