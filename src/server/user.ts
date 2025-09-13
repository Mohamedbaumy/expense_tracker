import * as bcrypt from "bcryptjs";
import { count, eq } from "drizzle-orm";
import { getRandomBytes } from 'expo-random';
import * as SecureStore from 'expo-secure-store';
import { db, SESSION_KEY } from "../db/database";
import { usersTable } from "../db/schema";



export const getUser = async (id: number) => {
  const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (user.length === 0) {
    throw new Error("User not found");
  }
  return user[0];
};

export const getUserCount = async () => {
  const result = await db.select({ count: count() }).from(usersTable);
  return result[0]?.count || 0;
};

export const registerUser = async (user: typeof usersTable.$inferInsert) => {
  if (typeof (bcrypt as any).setRandomFallback === 'function') {
    (bcrypt as any).setRandomFallback((length: number) => Array.from(getRandomBytes(length)));
  }
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.username, user.username));
  if (existingUser.length > 0) {
    throw new Error("User already exists");
  }
  console.log("user.password", user.password);
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const result = await db.insert(usersTable).values({ ...user, password: hashedPassword }).returning();

  await SecureStore.setItemAsync(SESSION_KEY, result[0].id.toString());
  return result[0];
};

export const login = async (user: typeof usersTable.$inferSelect) => {
  console.time("login");
  if (typeof (bcrypt as any).setRandomFallback === 'function') {
    (bcrypt as any).setRandomFallback((length: number) => Array.from(getRandomBytes(length)));
  }
  const result = await db.select().from(usersTable).where(eq(usersTable.username, user.username));
  if (result.length === 0) {
    console.timeEnd("login");
    throw new Error("User not found");
  }
  const isPasswordValid = bcrypt.compareSync(user.password, result[0].password);
  if (!isPasswordValid) {
    console.timeEnd("login");
    throw new Error("Invalid password");
  }
  await SecureStore.setItemAsync(SESSION_KEY, result[0].id.toString());
  console.timeEnd("login");
  return result[0];
};

export const updateUser = async (user: typeof usersTable.$inferSelect) => {
  const result = await db
    .update(usersTable)
    .set(user)
    .where(eq(usersTable.id, user.id));
  return result;
};