import BottomSheet from "@/src/components/ui/BottomSheet";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { cn } from "@/src/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Category, Transaction, TransactionFormData } from "../types";

interface TransactionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  transaction?: Transaction;
  categories: Category[];
  formData: TransactionFormData;
  onUpdateFormData: (updates: Partial<TransactionFormData>) => void;
  onSave: () => void;
  onCreateCategory: (name: string) => Promise<any>;
  isLoading?: boolean;
  isCreatingCategory?: boolean;
}

export const TransactionBottomSheet: React.FC<TransactionBottomSheetProps> = ({
  visible,
  onClose,
  mode,
  transaction,
  categories,
  formData,
  onUpdateFormData,
  onSave,
  onCreateCategory,
  isLoading = false,
  isCreatingCategory = false,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    try {
      const newCategory = await onCreateCategory(newCategoryName.trim());
      onUpdateFormData({ selectedCategory: newCategory.title });
      setShowNewCategoryInput(false);
      setNewCategoryName("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create category");
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={mode === "create" ? "New Transaction" : "Edit Transaction"}
    >
      <View className="p-6">
        {/* Transaction Type Selection */}
        <View className="flex-row items-center justify-between gap-4 mb-6">
          <Button
            title={
              <View className="flex-row items-center gap-2">
                <View
                  className={cn(
                    "rounded-full p-1",
                    formData.type === "expense" ? "bg-secondary" : "bg-red-500"
                  )}
                >
                  <Ionicons
                    name="arrow-down-outline"
                    size={16}
                    color={formData.type === "expense" ? "#8B593E" : "white"}
                  />
                </View>
                <Text
                  className={cn(
                    "text-xl font-bold",
                    formData.type === "expense"
                      ? "text-secondary"
                      : "text-foreground"
                  )}
                >
                  Expense
                </Text>
              </View>
            }
            className={cn(
              "!rounded-full flex-1 !p-2",
              formData.type !== "expense" && "bg-secondary border border-border"
            )}
            onPress={() => onUpdateFormData({ type: "expense" })}
          />
          <Button
            title={
              <View className="flex-row items-center gap-2">
                <View
                  className={cn(
                    "rounded-full p-1",
                    formData.type === "income" ? "bg-secondary" : "bg-green-500"
                  )}
                >
                  <Ionicons
                    name="arrow-up-outline"
                    size={16}
                    color={formData.type === "income" ? "#8B593E" : "white"}
                  />
                </View>
                <Text
                  className={cn(
                    "text-xl font-bold",
                    formData.type === "income"
                      ? "text-secondary"
                      : "text-foreground"
                  )}
                >
                  Income
                </Text>
              </View>
            }
            className={cn(
              "!rounded-full flex-1 !p-2",
              formData.type !== "income" && "bg-secondary border border-border"
            )}
            onPress={() => onUpdateFormData({ type: "income" })}
          />
        </View>

        {/* Amount Input */}
        <View className="flex-row items-center py-4 border-b border-border mb-6">
          <Text className="text-foreground text-5xl font-bold">$</Text>
          <TextInput
            placeholder="0.00"
            value={formData.amount ? formData.amount.toString() : ""}
            onChangeText={(text) =>
              onUpdateFormData({ amount: parseFloat(text) || 0 })
            }
            className="text-foreground text-5xl font-bold mt-4 flex-1"
            placeholderTextColor="#918A84"
            keyboardType="numeric"
          />
        </View>

        {/* Title Input */}
        <View className="mb-6">
          <Input
            label="Transaction Title"
            value={formData.title}
            onChangeText={(text) => onUpdateFormData({ title: text })}
            className="w-full"
            icon={<Ionicons name="create-outline" size={24} color="#918A84" />}
          />
        </View>

        {/* Category Section */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="pricetag-outline" size={16} color="#918A84" />
            <Text className="text-foreground text-lg font-semibold">
              Category
            </Text>
          </View>

          {/* Existing Categories */}
          <View className="flex-row flex-wrap gap-3 mb-4">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() =>
                  onUpdateFormData({ selectedCategory: category.title })
                }
                className={cn(
                  "px-4 py-2 rounded-full border",
                  formData.selectedCategory === category.title
                    ? "bg-primary border-primary"
                    : "bg-transparent border-border"
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-medium",
                    formData.selectedCategory === category.title
                      ? "text-white"
                      : "text-foreground"
                  )}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Create New Category */}
          {!showNewCategoryInput ? (
            <TouchableOpacity
              onPress={() => setShowNewCategoryInput(true)}
              className="px-4 py-2 rounded-full border border-dashed border-border bg-transparent"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="add-outline" size={16} color="#918A84" />
                <Text className="text-sm font-medium text-foreground">
                  Create New Category
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View className="flex-row items-center gap-2">
              <Input
                label=""
                placeholder="Enter category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                className="flex-1"
              />
              <TouchableOpacity
                onPress={handleCreateCategory}
                disabled={isCreatingCategory}
                className="px-4 py-2 bg-primary rounded-full"
              >
                <Text className="text-white text-sm font-medium">
                  {isCreatingCategory ? "Creating..." : "Create"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowNewCategoryInput(false);
                  setNewCategoryName("");
                }}
                className="px-4 py-2 bg-secondary rounded-full"
              >
                <Text className="text-foreground text-sm font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Save Button */}
        <Button
          title={
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-white text-lg font-bold">
                {isLoading ? "Saving..." : "Save"}
              </Text>
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
          }
          className="w-full bg-primary py-4 rounded-xl"
          onPress={onSave}
          disabled={isLoading}
        />
      </View>
    </BottomSheet>
  );
};
