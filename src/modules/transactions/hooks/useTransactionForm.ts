import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Category, Transaction, TransactionFormData } from "../types";
import { useCreateCategory, useCreateTransaction, useUpdateTransaction } from "./useTransactions";

interface UseTransactionFormProps {
  mode: "create" | "edit";
  transaction?: Transaction;
  categories: Category[];
  userId: number;
  onSuccess?: () => void;
}

export const useTransactionForm = ({
  mode,
  transaction,
  categories,
  userId,
  onSuccess,
}: UseTransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    amount: 0,
    title: "",
    selectedCategory: "",
  });

  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const createCategoryMutation = useCreateCategory();

  // Initialize form with transaction data for edit mode
  useEffect(() => {
    if (mode === "edit" && transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        title: transaction.title,
        selectedCategory: "",
      });

      // Find the category name from the database categories
      const category = categories.find((cat) => cat.id === transaction.categoryId);
      if (category) {
        setFormData(prev => ({ ...prev, selectedCategory: category.title }));
      }
    } else {
      // Reset form for create mode
      setFormData({
        type: "expense",
        amount: 0,
        title: "",
        selectedCategory: "",
      });
    }
  }, [mode, transaction, categories]);

  const updateFormData = (updates: Partial<TransactionFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const newCategory = await createCategoryMutation.mutateAsync({
        title: name,
      });
      setFormData(prev => ({ ...prev, selectedCategory: newCategory.title }));
      return newCategory;
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    if (!formData.amount || !formData.title || !formData.selectedCategory) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!userId || userId === 0) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    let categoryId: number;

    // Check if it's a new category
    if (formData.newCategoryName) {
      try {
        const newCategory = await createCategoryMutation.mutateAsync({
          title: formData.newCategoryName.trim(),
        });
        categoryId = newCategory.id;
      } catch (error) {
        return; // Error is handled in onError callback
      }
    } else {
      // Find the category ID from the database categories
      const category = categories.find(
        (cat) =>
          cat.title.toLowerCase().includes(formData.selectedCategory.toLowerCase()) ||
          formData.selectedCategory.toLowerCase().includes(cat.title.toLowerCase())
      );

      if (!category) {
        Alert.alert("Error", "Selected category not found");
        return;
      }
      categoryId = category.id;
    }

    try {
      if (mode === "create") {
        await createTransactionMutation.mutateAsync({
          title: formData.title.trim(),
          amount: formData.amount,
          type: formData.type,
          categoryId,
          userId,
          date: new Date().toISOString(),
        });
      } else if (mode === "edit" && transaction) {
        await updateTransactionMutation.mutateAsync({
          id: transaction.id,
          userId,
          updateData: {
            title: formData.title.trim(),
            amount: formData.amount,
            type: formData.type,
            categoryId,
          },
        });
      }

      onSuccess?.();
    } catch (error) {
      // Error is handled in onError callback
    }
  };

  return {
    formData,
    updateFormData,
    handleSave,
    handleCreateCategory,
    isLoading: createTransactionMutation.isPending || updateTransactionMutation.isPending,
    isCreatingCategory: createCategoryMutation.isPending,
  };
};
