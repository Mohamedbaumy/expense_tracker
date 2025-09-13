// Example usage of the transaction CRUD system
import {
  createCategory,
  createTransaction,
  deleteTransaction,
  getCategories,
  getTransaction,
  getTransactions,
  getTransactionStats,
  NotFoundError,
  TransactionError,
  TransactionInsert,
  updateTransaction,
  ValidationError
} from "./transactions";

// Example: Creating a new transaction
export const exampleCreateTransaction = async (userId: number) => {
  try {
    const newTransaction: TransactionInsert = {
      title: "Coffee Shop",
      amount: 500, // $5.00 (stored in cents)
      type: "expense",
      categoryId: 1, // Assuming category with id 1 exists
      date: new Date().toISOString(),
      userId: userId
    };

    const transaction = await createTransaction(newTransaction);
    console.log("Transaction created:", transaction);
    return transaction;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error("Validation error:", error.message, "Field:", error.field);
    } else if (error instanceof NotFoundError) {
      console.error("Not found error:", error.message);
    } else if (error instanceof TransactionError) {
      console.error("Transaction error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// Example: Getting transactions with filters
export const exampleGetTransactions = async (userId: number) => {
  try {
    // Get all transactions for a user
    const allTransactions = await getTransactions(userId);
    console.log("All transactions:", allTransactions);

    // Get only income transactions
    const incomeTransactions = await getTransactions(userId, {
      type: "income",
      limit: 10
    });
    console.log("Income transactions:", incomeTransactions);

    // Get transactions for a specific date range
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Last month
    
    const recentTransactions = await getTransactions(userId, {
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
      limit: 20
    });
    console.log("Recent transactions:", recentTransactions);

    return { allTransactions, incomeTransactions, recentTransactions };
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
};

// Example: Updating a transaction
export const exampleUpdateTransaction = async (transactionId: number, userId: number) => {
  try {
    const updatedTransaction = await updateTransaction(transactionId, userId, {
      title: "Updated Coffee Shop",
      amount: 600, // $6.00
    });
    console.log("Transaction updated:", updatedTransaction);
    return updatedTransaction;
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error("Transaction not found or doesn't belong to user");
    } else if (error instanceof ValidationError) {
      console.error("Validation error:", error.message);
    } else {
      console.error("Error updating transaction:", error);
    }
    throw error;
  }
};

// Example: Getting transaction statistics
export const exampleGetStats = async (userId: number) => {
  try {
    // Get stats for all time
    const allTimeStats = await getTransactionStats(userId);
    console.log("All time stats:", allTimeStats);

    // Get stats for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await getTransactionStats(
      userId, 
      startOfMonth.toISOString(), 
      new Date().toISOString()
    );
    console.log("Monthly stats:", monthlyStats);

    return { allTimeStats, monthlyStats };
  } catch (error) {
    console.error("Error getting stats:", error);
    throw error;
  }
};

// Example: Category management
export const exampleCategoryManagement = async () => {
  try {
    // Get all categories
    const categories = await getCategories();
    console.log("All categories:", categories);

    // Create a new category
    const newCategory = await createCategory({ title: "Custom Category" });
    console.log("New category created:", newCategory);

    return { categories, newCategory };
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error("Category validation error:", error.message);
    } else {
      console.error("Error managing categories:", error);
    }
    throw error;
  }
};

// Example: Complete transaction workflow
export const exampleCompleteWorkflow = async (userId: number) => {
  try {
    console.log("=== Starting Complete Transaction Workflow ===");

    // 1. Get available categories
    const categories = await getCategories();
    console.log("Available categories:", categories);

    if (categories.length === 0) {
      throw new Error("No categories available. Please create categories first.");
    }

    // 2. Create a new transaction
    const newTransaction = await createTransaction({
      title: "Grocery Shopping",
      amount: 2500, // $25.00
      type: "expense",
      categoryId: categories[0].id,
      date: new Date().toISOString(),
      userId: userId
    });
    console.log("Created transaction:", newTransaction);

    // 3. Get the transaction
    const retrievedTransaction = await getTransaction(newTransaction.id, userId);
    console.log("Retrieved transaction:", retrievedTransaction);

    // 4. Update the transaction
    const updatedTransaction = await updateTransaction(newTransaction.id, userId, {
      amount: 3000, // $30.00
      title: "Updated Grocery Shopping"
    });
    console.log("Updated transaction:", updatedTransaction);

    // 5. Get transaction statistics
    const stats = await getTransactionStats(userId);
    console.log("Transaction stats:", stats);

    // 6. Get recent transactions
    const recentTransactions = await getTransactions(userId, {
      limit: 5,
      offset: 0
    });
    console.log("Recent transactions:", recentTransactions);

    // 7. Delete the transaction (cleanup)
    await deleteTransaction(newTransaction.id, userId);
    console.log("Transaction deleted successfully");

    console.log("=== Complete Transaction Workflow Finished ===");
    
    return {
      created: newTransaction,
      updated: updatedTransaction,
      stats,
      recent: recentTransactions
    };
  } catch (error) {
    console.error("Error in complete workflow:", error);
    throw error;
  }
};

// Error handling examples
export const exampleErrorHandling = async (userId: number) => {
  try {
    // This will throw a ValidationError
    await createTransaction({
      title: "", // Empty title
      amount: -100, // Negative amount
      type: "invalid", // Invalid type
      categoryId: 0, // Invalid category
      date: "invalid-date", // Invalid date
      userId: userId
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("Caught validation error:", error.message);
      console.log("Field with error:", error.field);
    } else {
      console.log("Unexpected error type:", error);
    }
  }

  try {
    // This will throw a NotFoundError
    await getTransaction(99999, userId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log("Caught not found error:", error.message);
    } else {
      console.log("Unexpected error type:", error);
    }
  }

  try {
    // This will throw a TransactionError
    await updateTransaction(99999, userId, { title: "Test" });
  } catch (error) {
    if (error instanceof TransactionError) {
      console.log("Caught transaction error:", error.message);
    } else {
      console.log("Unexpected error type:", error);
    }
  }
};
