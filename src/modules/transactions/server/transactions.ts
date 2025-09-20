import { and, count, desc, eq, gte, lte, or } from "drizzle-orm";
import { db } from "../../../db/database";
import { categoriesTable, transactionsTable, usersTable } from "../../../db/schema";

// Types for better type safety
export type TransactionInsert = typeof transactionsTable.$inferInsert;
export type CategoryInsert = typeof categoriesTable.$inferInsert;

export class TransactionError extends Error {
  constructor(message: string, public code: string = "TRANSACTION_ERROR") {
    super(message);
    this.name = "TransactionError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`);
    this.name = "NotFoundError";
  }
}

const validateTransaction = (transaction: Partial<TransactionInsert>): void => {
  if (!transaction.title || transaction.title.trim().length === 0) {
    throw new ValidationError("Title is required", "title");
  }
  
  if (!transaction.amount || transaction.amount <= 0) {
    throw new ValidationError("Amount must be greater than 0", "amount");
  }
  
  if (!transaction.type || !["income", "expense"].includes(transaction.type)) {
    throw new ValidationError("Type must be either 'income' or 'expense'", "type");
  }
  
  if (!transaction.categoryId || transaction.categoryId <= 0) {
    throw new ValidationError("Valid category is required", "categoryId");
  }
  
  if (!transaction.userId || transaction.userId <= 0) {
    throw new ValidationError("Valid user is required", "userId");
  }
  
  if (!transaction.date) {
    throw new ValidationError("Date is required", "date");
  }
  
  // Validate date format (ISO string)
  const date = new Date(transaction.date);
  if (isNaN(date.getTime())) {
    throw new ValidationError("Invalid date format", "date");
  }
};

const validateCategory = (category: Partial<CategoryInsert>): void => {
  if (!category.title || category.title.trim().length === 0) {
    throw new ValidationError("Category title is required", "title");
  }
  
  if (category.title.trim().length > 50) {
    throw new ValidationError("Category title must be less than 50 characters", "title");
  }
};

export const createTransaction = async (transactionData: TransactionInsert): Promise<Transaction> => {
  try {
    validateTransaction(transactionData);
    
    const user = await db.select().from(usersTable).where(eq(usersTable.id, transactionData.userId));
    if (user.length === 0) {
      throw new NotFoundError("User", transactionData.userId);
    }
    
    const category = await db.select().from(categoriesTable).where(eq(categoriesTable.id, transactionData.categoryId));
    if (category.length === 0) {
      throw new NotFoundError("Category", transactionData.categoryId);
    }
    
    const result = await db
      .insert(transactionsTable)
      .values(transactionData)
      .returning();
    
    if (result.length === 0) {
      throw new TransactionError("Failed to create transaction");
    }
    
    return result[0];
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error("Error creating transaction:", error);
    throw new TransactionError("Failed to create transaction");
  }
};

export const getTransaction = async (id: number, userId: number): Promise<Transaction> => {
  try {
    const result = await db
      .select()
      .from(transactionsTable)
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)));
    
    if (result.length === 0) {
      throw new NotFoundError("Transaction", id);
    }
    
    return result[0];
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error("Error fetching transaction:", error);
    throw new TransactionError("Failed to fetch transaction");
  }
};

export const getTransactions = async (
  userId: number,
  options: {
    limit?: number;
    offset?: number;
    type?: "income" | "expense";
    categoryId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
  } = {}
): Promise<{ transactions: Transaction[]; total: number }> => {
  try {
    const { limit = 50, offset = 0, type, categoryId, startDate, endDate, search } = options;
    
    // Build where conditions
    const conditions = [eq(transactionsTable.userId, userId)];
    
    if (type) {
      conditions.push(eq(transactionsTable.type, type));
    }
    
    if (categoryId) {
      conditions.push(eq(transactionsTable.categoryId, categoryId));
    }
    
    if (startDate) {
      conditions.push(gte(transactionsTable.date, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(transactionsTable.date, endDate));
    }
    
    if (search) {
      conditions.push(or(
        eq(transactionsTable.title, search),
      ));
    }
    
    const totalResult = await db
      .select({ count: count() })
      .from(transactionsTable)
      .where(and(...conditions));
    
    const total = totalResult[0]?.count || 0;
    
    const transactions = await db
      .select()
      .from(transactionsTable)
      .where(and(...conditions))
      .orderBy(desc(transactionsTable.date))
      .limit(limit)
      .offset(offset);
    
    return { transactions, total };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new TransactionError("Failed to fetch transactions");
  }
};

export const updateTransaction = async (
  id: number,
  userId: number,
  updateData: Partial<TransactionInsert>
): Promise<Transaction> => {
  try {
    const existingTransaction = await getTransaction(id, userId);
    
    const updatedTransaction = { ...existingTransaction, ...updateData };
    validateTransaction(updatedTransaction);
    
    if (updateData.categoryId && updateData.categoryId !== existingTransaction.categoryId) {
      const category = await db.select().from(categoriesTable).where(eq(categoriesTable.id, updateData.categoryId));
      if (category.length === 0) {
        throw new NotFoundError("Category", updateData.categoryId);
      }
    }
    
    const result = await db
      .update(transactionsTable)
      .set(updateData)
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)))
      .returning();
    
    if (result.length === 0) {
      throw new TransactionError("Failed to update transaction");
    }
    
    return result[0];
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof TransactionError) {
      throw error;
    }
    console.error("Error updating transaction:", error);
    throw new TransactionError("Failed to update transaction");
  }
};

export const deleteTransaction = async (id: number, userId: number): Promise<void> => {
  try {
    await getTransaction(id, userId);
    
    const result = await db
      .delete(transactionsTable)
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)));
    
    if (result.changes === 0) {
      throw new TransactionError("Failed to delete transaction");
    }
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof TransactionError) {
      throw error;
    }
    console.error("Error deleting transaction:", error);
    throw new TransactionError("Failed to delete transaction");
  }
};

export const createCategory = async (categoryData: CategoryInsert): Promise<Category> => {
  try {
    validateCategory(categoryData);
    
    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.title, categoryData.title.trim()));
    
    if (existingCategory.length > 0) {
      throw new ValidationError("Category with this title already exists", "title");
    }
    
    const result = await db
      .insert(categoriesTable)
      .values({ title: categoryData.title.trim() })
      .returning();
    
    if (result.length === 0) {
      throw new TransactionError("Failed to create category");
    }
    
    return result[0];
  } catch (error) {
    if (error instanceof ValidationError || error instanceof TransactionError) {
      throw error;
    }
    console.error("Error creating category:", error);
    throw new TransactionError("Failed to create category");
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await db
      .select()
      .from(categoriesTable)
      .orderBy(categoriesTable.title);
    
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new TransactionError("Failed to fetch categories");
  }
};

export const getCategory = async (id: number): Promise<Category> => {
  try {
    const result = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id));
    
    if (result.length === 0) {
      throw new NotFoundError("Category", id);
    }
    
    return result[0];
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error("Error fetching category:", error);
    throw new TransactionError("Failed to fetch category");
  }
};

export const updateCategory = async (id: number, updateData: Partial<CategoryInsert>): Promise<Category> => {
  try {
    await getCategory(id);
    
    if (updateData.title) {
      validateCategory(updateData);
      
      const existingCategory = await db
        .select()
        .from(categoriesTable)
        .where(and(
          eq(categoriesTable.title, updateData.title.trim()),
          eq(categoriesTable.id, id)
        ));
      
      if (existingCategory.length > 0) {
        throw new ValidationError("Category with this title already exists", "title");
      }
    }
    
    const result = await db
      .update(categoriesTable)
      .set(updateData)
      .where(eq(categoriesTable.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new TransactionError("Failed to update category");
    }
    
    return result[0];
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof TransactionError) {
      throw error;
    }
    console.error("Error updating category:", error);
    throw new TransactionError("Failed to update category");
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await getCategory(id);
    
    const transactionsUsingCategory = await db
      .select({ count: count() })
      .from(transactionsTable)
      .where(eq(transactionsTable.categoryId, id));
    
    if (transactionsUsingCategory[0]?.count > 0) {
      throw new ValidationError("Cannot delete category that is being used by transactions");
    }
    
    const result = await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, id));
    
    if (result.changes === 0) {
      throw new TransactionError("Failed to delete category");
    }
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof TransactionError) {
      throw error;
    }
    console.error("Error deleting category:", error);
    throw new TransactionError("Failed to delete category");
  }
};


export const getTransactionStats = async (userId: number, startDate?: string, endDate?: string) => {
  try {
    const conditions = [eq(transactionsTable.userId, userId)];
    
    if (startDate) {
      conditions.push(gte(transactionsTable.date, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(transactionsTable.date, endDate));
    }
    
    const [incomeResult, expenseResult] = await Promise.all([
      db
        .select({ total: count(), sum: transactionsTable.amount })
        .from(transactionsTable)
        .where(and(...conditions, eq(transactionsTable.type, "income"))),
      db
        .select({ total: count(), sum: transactionsTable.amount })
        .from(transactionsTable)
        .where(and(...conditions, eq(transactionsTable.type, "expense")))
    ]);
    
    const income = incomeResult[0] || { total: 0, sum: 0 };
    const expenses = expenseResult[0] || { total: 0, sum: 0 };
    
    return {
      totalIncome: income.sum || 0,
      totalExpenses: expenses.sum || 0,
      totalTransactions: (income.total || 0) + (expenses.total || 0),
      balance: (income.sum || 0) - (expenses.sum || 0),
      incomeCount: income.total || 0,
      expenseCount: expenses.total || 0,
    };
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    throw new TransactionError("Failed to fetch transaction statistics");
  }
};
