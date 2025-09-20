import Button from "@/src/components/ui/Button";
import StaticCard from "@/src/components/ui/StaticCard";
import { SESSION_KEY } from "@/src/db/database";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
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
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user", session],
    queryFn: () => getUser(parseInt(session ?? "0")),
    enabled: !!session,
  });

  const logout = async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    queryClient.clear(); // Clear all cached data
    router.push("/Login");
  };

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
    setSelectedTransaction(null);
    setShowTransactionManager(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionMode("edit");
    setSelectedTransaction(transaction);
    setShowTransactionManager(true);
  };

  const handleCloseTransactionManager = () => {
    setShowTransactionManager(false);
    setSelectedTransaction(null);
  };

  // Create data for FlatList sections
  const listData = [
    { type: "header", id: "header" },
    { type: "stats", id: "stats" },
    { type: "transactions", id: "transactions" },
  ];

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "header":
        return (
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Image
                source={require("../../../../assets/images/logo.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
              <View>
                <Text className="text-muted text-base font-semibold">
                  Welcome
                </Text>
                <Text className="text-foreground text-xl">
                  {user?.username}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3 items-center">
              <Button
                title={
                  <View className="flex-row gap-2 items-center">
                    <Ionicons name="add-outline" size={20} color="white" />
                    <Text className="text-white font-medium">Add</Text>
                  </View>
                }
                className="rounded-full px-4 py-2"
                onPress={handleCreateTransaction}
              />
              <Pressable className="p-2" onPress={logout}>
                <Ionicons name="log-out-outline" size={24} color="#8B593E" />
              </Pressable>
            </View>
          </View>
        );
      case "stats":
        return (
          <View className="p-4">
            <StaticCard />
          </View>
        );
      case "transactions":
        return (
          <View className="p-4">
            <Transactions onEditTransaction={handleEditTransaction} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor="#8B593E"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <TransactionManager
        mode={transactionMode}
        transaction={selectedTransaction}
        userId={parseInt(session ?? "0")}
        visible={showTransactionManager}
        onClose={handleCloseTransactionManager}
        onSuccess={handleRefresh}
      />
    </View>
  );
};
