import React from "react";
import { View } from "react-native";
import { useTransactionForm } from "../hooks/useTransactionForm";
import { useCategories } from "../hooks/useTransactions";
import { Transaction } from "../types";
import { TransactionBottomSheet } from "./TransactionBottomSheet";

interface TransactionManagerProps {
  mode: "create" | "edit";
  transaction?: Transaction;
  userId: number;
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TransactionManager: React.FC<TransactionManagerProps> = ({
  mode,
  transaction,
  userId,
  visible,
  onClose,
  onSuccess,
}) => {
  const { data: categories = [] } = useCategories();

  const {
    formData,
    updateFormData,
    handleSave,
    handleCreateCategory,
    isLoading,
    isCreatingCategory,
  } = useTransactionForm({
    mode,
    transaction,
    categories,
    userId,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  return (
    <View>
      <TransactionBottomSheet
        visible={visible}
        onClose={onClose}
        mode={mode}
        transaction={transaction}
        categories={categories}
        formData={formData}
        onUpdateFormData={updateFormData}
        onSave={handleSave}
        onCreateCategory={handleCreateCategory}
        isLoading={isLoading}
        isCreatingCategory={isCreatingCategory}
      />
    </View>
  );
};
