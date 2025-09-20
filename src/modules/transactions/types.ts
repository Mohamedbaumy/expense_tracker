export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  categoryId: number;
  date: string;
  userId: number;
}

export interface Category {
  id: number;
  title: string;
}

export interface TransactionFormData {
  type: "income" | "expense";
  amount: number;
  title: string;
  selectedCategory: string;
  newCategoryName?: string;
}

export interface CreateTransactionData {
  title: string;
  amount: number;
  type: "income" | "expense";
  categoryId: number;
  userId: number;
  date: string;
}

export interface UpdateTransactionData {
  title?: string;
  amount?: number;
  type?: "income" | "expense";
  categoryId?: number;
}

export interface CreateCategoryData {
  title: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  totalTransactions: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
}

export interface TransactionFilters {
  limit?: number;
  offset?: number;
  type?: "income" | "expense";
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
}
