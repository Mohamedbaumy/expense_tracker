import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
    createCategory,
    createTransaction,
    deleteTransaction,
    getCategories,
    getTransaction,
    getTransactions,
    getTransactionStats,
    updateTransaction,
} from "../server/transactions";
import {
    Transaction,
    TransactionFilters,
    TransactionListResponse,
    TransactionStats,
    UpdateTransactionData
} from "../types";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useTransactions = (
  userId: number,
  filters: TransactionFilters = {}
) => {
  return useQuery<TransactionListResponse>({
    queryKey: ["transactions", userId, filters],
    queryFn: () => getTransactions(userId, filters),
    enabled: !!userId,
  });
};

export const useTransaction = (id: number, userId: number) => {
  return useQuery<Transaction>({
    queryKey: ["transaction", id],
    queryFn: () => getTransaction(id, userId),
    enabled: !!id && !!userId,
  });
};

export const useTransactionStats = (userId: number, startDate?: string, endDate?: string) => {
  return useQuery<TransactionStats>({
    queryKey: ["transactionStats", userId, startDate, endDate],
    queryFn: () => getTransactionStats(userId, startDate, endDate),
    enabled: !!userId,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (data) => {
      // Invalidate and refetch transactions and stats
      queryClient.invalidateQueries({ queryKey: ["transactions", data.userId] });
      queryClient.invalidateQueries({ queryKey: ["transactionStats", data.userId] });
      Alert.alert("Success", "Transaction created successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to create transaction");
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId, updateData }: { id: number; userId: number; updateData: UpdateTransactionData }) =>
      updateTransaction(id, userId, updateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions", data.userId] });
      queryClient.invalidateQueries({ queryKey: ["transaction", data.id] });
      queryClient.invalidateQueries({ queryKey: ["transactionStats", data.userId] });
      Alert.alert("Success", "Transaction updated successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to update transaction");
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) =>
      deleteTransaction(id, userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      queryClient.invalidateQueries({ queryKey: ["transactionStats", userId] });
      Alert.alert("Success", "Transaction deleted successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to delete transaction");
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to create category");
    },
  });
};
