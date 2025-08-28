import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import migrations from "./migrations.js";

export const DATABASE_NAME = "expense_tracker";

export function useDatabaseSetup() {
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [db, setDb] = useState<ReturnType<typeof drizzle> | null>(null);

  // Memoize the database instance to prevent recreation on every render
  const expoDatabase = useMemo(() => openDatabaseSync(DATABASE_NAME), []);
  const drizzleDb = useMemo(() => drizzle(expoDatabase), [expoDatabase]);
  
  const { success, error } = useMigrations(drizzleDb, migrations);

  useEffect(() => {
    if (error) {
      console.error("Migration error details:", error);
      setMigrationError(error.message || "Unknown migration error");
    }

    if (success) {
      console.log("Migrations completed successfully");
      setDb(drizzleDb);
      setIsLoading(false);
    } else if (error) {
      setIsLoading(false);
    }
  }, [success, error]); // Removed drizzleDb from dependencies

  return {
    db,
    isLoading,
    migrationError,
    success,
  };
}
