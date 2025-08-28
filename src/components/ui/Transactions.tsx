import React from "react";
import { FlatList, Text, View } from "react-native";
import TransactionItem from "./TransactionItem";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

const Transactions = () => {
  const transactions: Transaction[] = [
    {
      id: 1,
      title: "Salary",
      amount: 100,
      type: "income",
      category: "Salary",
      date: "May 17, 2025",
    },
    {
      id: 2,
      title: "Food",
      amount: 200,
      type: "expense",
      category: "Food",
      date: "May 17, 2025",
    },
  ];
  return (
    <View>
      <Text className="text-foreground text-2xl font-semibold">
        Recent Transactions
      </Text>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        className="mt-4"
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );
};

export default Transactions;
