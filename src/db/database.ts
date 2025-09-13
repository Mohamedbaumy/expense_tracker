import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const DATABASE_NAME = "expense_tracker";

// Create a singleton database instance
const expoDatabase = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDatabase);
export const SESSION_KEY = "session.userId"
