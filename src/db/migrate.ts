import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://studydock:studydock_password@localhost:5433/studydock";

async function runMigrations() {
  console.log("Connecting to PostgreSQL for migrations...");
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  console.log("Applying migrations from ./src/db/migrations...");
  const migrationsFolder = path.resolve(__dirname, "./migrations");

  try {
    await migrate(db, { migrationsFolder });
    console.log("✓ All migrations successfully applied.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

if (require.main === module) {
  runMigrations();
}

export { runMigrations };
