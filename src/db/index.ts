import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url || url === "your_neon_connection_string") {
    throw new Error(
      "Database not configured. Set DATABASE_URL in .env.local with your Neon connection string."
    );
  }
  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

// Lazy proxy: `db` is a proxy that calls getDb() on first access
// This avoids crashing at import time when DB URL isn't configured
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
