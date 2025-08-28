import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Database utility functions
export const resetDatabase = async (databaseName: string) => {
  try {
    // This would need to be implemented based on your specific needs
    // For now, we'll just log the action
    console.log(`Resetting database: ${databaseName}`);
    
    // In a real implementation, you might:
    // 1. Close the database connection
    // 2. Delete the database file
    // 3. Recreate the database
    // 4. Re-run migrations
    
    return true;
  } catch (error) {
    console.error("Failed to reset database:", error);
    return false;
  }
};
