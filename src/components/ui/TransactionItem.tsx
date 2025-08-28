import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { cn } from "../../lib/utils";
import { Transaction } from "./Transactions";

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isIncome = transaction.type === "income";

  return (
    <View className="bg-white p-4 rounded-lg shadow-lg ">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <View
            className={cn(
              "w-10 h-10 rounded-full items-center justify-center",
              isIncome ? "bg-success/10" : "bg-danger/10"
            )}
          >
            <Ionicons
              name={isIncome ? "arrow-up-outline" : "arrow-down-outline"}
              size={20}
              color={isIncome ? "#3FC37E" : "#E25548"}
            />
          </View>
          <View>
            <Text className="text-foreground font-semibold text-base">
              {transaction.title}
            </Text>
            <Text className="text-muted text-sm">{transaction.category}</Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <View>
            <Text
              className={cn(
                "text-lg font-bold",
                isIncome ? "text-success" : "text-danger"
              )}
            >
              {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
            </Text>
            <Text className="text-muted text-sm">{transaction.date}</Text>
          </View>
          <View className="border-l border-border pl-4 ml-4">
            <TouchableOpacity className="py-2">
              <Ionicons name="trash-outline" size={24} color="#E25548" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransactionItem;
