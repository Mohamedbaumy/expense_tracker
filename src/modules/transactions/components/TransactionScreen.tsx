import { MainLayout } from "@/src/components/layout/MainLayout";
import StaticCard from "@/src/components/ui/StaticCard";
import { SESSION_KEY } from "@/src/db/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { getUser } from "../../auth/server/user";
import { Transaction } from "../types";
import { TransactionManager } from "./TransactionManager";
import { Transactions } from "./Transactions";

export const TransactionScreen: React.FC = () => {
  const session = SecureStore.getItem(SESSION_KEY);
  const queryClient = useQueryClient();
  const [showTransactionManager, setShowTransactionManager] = useState(false);
  const [transactionMode, setTransactionMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >(undefined);

  const { data: user } = useQuery({
    queryKey: ["user", session],
    queryFn: () => getUser(parseInt(session ?? "0")),
    enabled: !!session,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["user", session] });
    queryClient.invalidateQueries({
      queryKey: ["transactions", parseInt(session ?? "0")],
    });
    queryClient.invalidateQueries({
      queryKey: ["transactionStats", parseInt(session ?? "0")],
    });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const handleCreateTransaction = () => {
    setTransactionMode("create");
    setSelectedTransaction(undefined);
    setShowTransactionManager(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionMode("edit");
    setSelectedTransaction(transaction);
    setShowTransactionManager(true);
  };

  const handleCloseTransactionManager = () => {
    setShowTransactionManager(false);
    setSelectedTransaction(undefined);
  };

  return (
    <MainLayout
      userName={user?.username}
      actions={[
        {
          icon: "add-outline",
          onPress: handleCreateTransaction,
          color: "#2C3E50",
          size: 24,
        },
      ]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor="#8B593E"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-4">
          <StaticCard />
        </View>
        <View className="p-4">
          <Transactions onEditTransaction={handleEditTransaction} />
        </View>
      </ScrollView>

      <TransactionManager
        mode={transactionMode}
        transaction={selectedTransaction}
        userId={parseInt(session ?? "0")}
        visible={showTransactionManager}
        onClose={handleCloseTransactionManager}
        onSuccess={handleRefresh}
      />
    </MainLayout>
  );
};
