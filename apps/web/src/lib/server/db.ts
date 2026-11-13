import "server-only";
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from "react";
import { getServerEnv } from "./env";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  internalNotes: string;
  name: string;
  createdAt: string;
};

// Simulate a database call that uses server secrets
export function getUserFromDB(userId: string): UserRecord {
  // In real code, this would use process.env.DATABASE_URL
  // The INTERNAL_CONFIG demonstrates server-only variable access
  const config = getServerEnv().INTERNAL_CONFIG;

  // Simulated database response with sensitive fields
  const user: UserRecord = {
    id: userId,
    email: "user@example.com",
    passwordHash: "bcrypt$2b$10$...", // NEVER expose this
    internalNotes: `VIP customer (config: ${config})`, // NEVER expose this
    name: "Jane Developer",
    createdAt: new Date().toISOString(),
  };

  // Layer 4: if this record (or the hash) is ever passed to a Client Component,
  // React throws instead of leaking it. Reading single fields stays allowed.
  // Tainting tracks references: a copy ({ ...user }) is NOT tainted.
  experimental_taintObjectReference(
    "Do not pass the full user record to the client. Use getUserDTO().",
    user
  );
  experimental_taintUniqueValue(
    "Do not pass password hashes to the client.",
    user,
    user.passwordHash
  );

  return user;
}
