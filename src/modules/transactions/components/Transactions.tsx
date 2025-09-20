import { SESSION_KEY } from "@/src/db/database";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getTransactions } from "../server/transactions";
import { Transaction } from "../types";
import { TransactionItem } from "./TransactionItem";

interface TransactionsProps {
  onEditTransaction?: (transaction: Transaction) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  onEditTransaction,
}) => {
  // Get user session
  const session = SecureStore.getItem(SESSION_KEY);
  const userId = parseInt(session ?? "0");

  // Fetch transactions from database
  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => getTransactions(userId, { limit: 20 }),
    enabled: !!userId && userId > 0,
  });

  const transactions = transactionsData?.transactions || [];

  if (isLoading) {
    return (
      <View>
        <Text className="text-foreground text-2xl font-semibold">
          Recent Transactions
        </Text>
        <View className="mt-4 flex items-center justify-center py-8">
          <ActivityIndicator size="large" color="#8B593E" />
          <Text className="text-muted mt-2">Loading transactions...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text className="text-foreground text-2xl font-semibold">
          Recent Transactions
        </Text>
        <View className="mt-4 flex items-center justify-center py-8">
          <Text className="text-red-500 text-center">
            Error loading transactions
          </Text>
        </View>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View>
        <Text className="text-foreground text-2xl font-semibold">
          Recent Transactions
        </Text>
        <View className="mt-4 flex items-center justify-center py-8">
          <Text className="text-muted text-center">
            No transactions found. Add your first transaction!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-foreground text-2xl font-semibold">
        Recent Transactions
      </Text>
      <View className="mt-4" style={{ gap: 16 }}>
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEditTransaction}
          />
        ))}
      </View>
    </View>
  );
};
