import { foreignKey, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  password: text().notNull(),
});

export const transactionsTable = sqliteTable("transactions_table", {
  id: int().primaryKey({ autoIncrement: true }), 
  title: text().notNull(),
  amount: int().notNull(),
  type: text().notNull(),
  categoryId: int().notNull(),
  date: text().notNull(),
  userId: int().notNull(),
}, (table) => ({
  userForeignKey: foreignKey({
    columns: [table.userId],
    foreignColumns: [usersTable.id],
    name: "fk_transactions_users",
  }),
  categoryForeignKey: foreignKey({
    columns: [table.categoryId],
    foreignColumns: [categoriesTable.id],
    name: "fk_transactions_categories",
  }),
}));

export const categoriesTable = sqliteTable("categories_table", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
});
