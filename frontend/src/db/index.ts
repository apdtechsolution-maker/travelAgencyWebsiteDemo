import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool: Pool | null = databaseUrl
  ? (globalForDb.__arenaNextJsPostgresqlPool ??= new Pool({ connectionString: databaseUrl }))
  : null;

export const db: NodePgDatabase | null = pool ? drizzle(pool) : null;
