import { SESSION_KEY } from "@/src/db/database";
import { getTransactionStats } from "@/src/modules/transactions/server/transactions";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Text, View } from "react-native";

const StaticCard = () => {
  // Get user session
  const session = SecureStore.getItem(SESSION_KEY);
  const userId = parseInt(session ?? "0");

  // Fetch transaction stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ["transactionStats", userId],
    queryFn: () => getTransactionStats(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <View className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <View className="mb-6">
          <Text className="text-muted text-lg mb-1">Total Balance</Text>
          <Text className="text-foreground text-4xl font-bold">Loading...</Text>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-muted text-center text-base mb-1">
              Income
            </Text>
            <Text className="text-success text-xl text-center font-semibold">
              Loading...
            </Text>
          </View>
          <View className="flex-1 items-end">
            <View className="border-l border-border pl-4">
              <Text className="text-muted text-center text-base mb-1">
                Expenses
              </Text>
              <Text className="text-danger text-xl text-center font-semibold">
                Loading...
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const balance = stats?.balance || 0;
  const totalIncome = stats?.totalIncome || 0;
  const totalExpenses = stats?.totalExpenses || 0;

  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm border border-border">
      <View className="mb-6">
        <Text className="text-muted text-lg mb-1">Total Balance</Text>
        <Text className="text-foreground text-4xl font-bold">
          ${balance.toFixed(2)}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-muted text-center text-base mb-1">Income</Text>
          <Text className="text-success text-xl text-center font-semibold">
            +${totalIncome.toFixed(2)}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <View className="border-l border-border pl-4">
            <Text className="text-muted text-center text-base mb-1">
              Expenses
            </Text>
            <Text className="text-danger text-xl text-center font-semibold">
              -${totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StaticCard;
