import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { usersTable } from "../db/schema";

export const getUser = async (drizzleDb: ReturnType<typeof drizzle>, id: number) => {
  const user = await drizzleDb.select().from(usersTable).where(eq(usersTable.id, id));
  return user;
};

export const getUserCount = async (drizzleDb: ReturnType<typeof drizzle>) => {
  const result = await drizzleDb.select({ count: count() }).from(usersTable);
  return result[0]?.count || 0;
};