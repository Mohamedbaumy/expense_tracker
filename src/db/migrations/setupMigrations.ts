import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect, useState } from "react";
import { setupDefaultCategories } from "../../server/categories";
import { db } from "../database";
import migrations from "./migrations.js";

export function useDatabaseSetup() {
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (error) {
      console.error("Migration error details:", error);
      setMigrationError(error.message || "Unknown migration error");
    }

    if (success) {
      console.log("Migrations completed successfully");
      
      setupDefaultCategories()
        .then(() => {
          console.log("Default categories setup completed");
          setIsReady(true);
          setIsLoading(false);
        })
        .catch((categoryError) => {
          console.error("Error setting up default categories:", categoryError);
          setIsReady(true);
          setIsLoading(false);
        });
    } else if (error) {
      setIsLoading(false);
    }
  }, [success, error]);

  return {
    db,
    isLoading,
    migrationError,
    success: isReady,
  };
}
