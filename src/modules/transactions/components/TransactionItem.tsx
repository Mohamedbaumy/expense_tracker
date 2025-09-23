import BottomSheet from "@/src/components/ui/BottomSheet";
import { SESSION_KEY } from "@/src/db/database";
import { cn } from "@/src/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { deleteTransaction, getCategories } from "../server/transactions";
import { Transaction } from "../types";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
}) => {
  const isIncome = transaction.type === "income";
  const [showActions, setShowActions] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  // Get user session
  const session = SecureStore.getItem(SESSION_KEY);
  const userId = parseInt(session ?? "0");

  const queryClient = useQueryClient();

  // Fetch categories to get category name
  const { data: categories = [], error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: 3,
    retryDelay: 1000,
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: (id: number) => deleteTransaction(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      queryClient.invalidateQueries({ queryKey: ["transactionStats", userId] });
      Alert.alert("Success", "Transaction deleted successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to delete transaction");
    },
  });

  const handleDelete = () => {
    setShowDeleteSheet(true);
  };

  const confirmDelete = () => {
    deleteTransactionMutation.mutate(transaction.id);
    setShowDeleteSheet(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(transaction);
    }
  };

  // Find category name from categories
  const categoryName = categoriesError
    ? "Loading..."
    : categories.find((cat: any) => cat.id === transaction.categoryId)?.title ||
      "Unknown";

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-lg">
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
            <Text className="text-muted text-sm">{categoryName}</Text>
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
            <Text className="text-muted text-sm">
              {formatDate(transaction.date)}
            </Text>
          </View>
          <View className="border-l border-border pl-4 ml-4">
            <TouchableOpacity
              className="py-2"
              onPress={() => setShowActions(!showActions)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#918A84" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showActions && (
        <View className="mt-3 pt-3 border-t border-border">
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-row items-center gap-2 flex-1 justify-center py-2 bg-blue-50 rounded-lg"
            >
              <Ionicons name="create-outline" size={16} color="#3B82F6" />
              <Text className="text-blue-600 font-medium">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              disabled={deleteTransactionMutation.isPending}
              className="flex-row items-center gap-2 flex-1 justify-center py-2 bg-red-50 rounded-lg"
            >
              <Ionicons name="trash-outline" size={16} color="#E25548" />
              <Text className="text-red-600 font-medium">
                {deleteTransactionMutation.isPending ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Delete Confirmation Bottom Sheet */}
      <BottomSheet
        visible={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        title="Delete Transaction"
      >
        <View className="p-6">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="trash-outline" size={32} color="#E25548" />
            </View>
            <Text className="text-foreground text-lg font-semibold text-center mb-2">
              Delete Transaction
            </Text>
            <Text className="text-muted text-center leading-6">
              Are you sure you want to delete &ldquo;{transaction.title}&rdquo;?
              This action cannot be undone.
            </Text>
          </View>

          <View className="gap-3">
            <TouchableOpacity
              onPress={confirmDelete}
              disabled={deleteTransactionMutation.isPending}
              className="bg-red-600 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-base">
                {deleteTransactionMutation.isPending
                  ? "Deleting..."
                  : "Delete Transaction"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDeleteSheet(false)}
              className="bg-secondary py-4 rounded-lg items-center"
            >
              <Text className="text-foreground font-semibold text-base">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};
