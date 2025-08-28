import React from "react";
import { Text, View } from "react-native";

const StaticCard = () => {
  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm border border-border">
      <View className="mb-6">
        <Text className="text-muted text-lg mb-1">Total Balance</Text>
        <Text className="text-foreground text-4xl font-bold">$1289.00</Text>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-muted text-center text-base mb-1">Income</Text>
          <Text className="text-success text-xl text-center font-semibold">
            +$2800.00
          </Text>
        </View>
        <View className="flex-1 items-end">
          <View className="border-l border-border pl-4">
            <Text className="text-muted text-center text-base mb-1">
              Expenses
            </Text>
            <Text className="text-danger text-xl text-center font-semibold">
              -$2800.00
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StaticCard;
