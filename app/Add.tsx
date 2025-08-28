import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { cn } from "@/src/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  { id: "food", name: "Food & Drinks", icon: "restaurant-outline" },
  { id: "shopping", name: "Shopping", icon: "cart-outline" },
  { id: "transport", name: "Transportation", icon: "car-outline" },
  { id: "entertainment", name: "Entertainment", icon: "film-outline" },
  { id: "bills", name: "Bills", icon: "document-text-outline" },
  { id: "income", name: "Income", icon: "wallet-outline" },
  { id: "other", name: "... Other", icon: "ellipsis-horizontal" },
];

const Add = () => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSave = () => {
    if (!amount || !title || !selectedCategory) {
      return;
    }

    console.log({
      type,
      amount: parseFloat(amount),
      title,
      category: selectedCategory,
      date: new Date().toISOString(),
    });

    router.push("/");
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-5 border-b border-border">
        <Link href="/">
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </Link>
        <Text className="text-foreground text-xl font-bold">
          New Transaction
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <View className="flex-row items-center justify-center">
            <Text className="text-muted text-xl font-bold">Save</Text>
            <Ionicons name="checkmark" size={16} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 p-4">
        <View className="mx-4 mt-5 bg-secondary rounded-lg shadow-lg p-6">
          <View className="flex-row items-center justify-between gap-4">
            <Button
              title={
                <View className="flex-row items-center gap-2">
                  <View
                    className={cn(
                      "rounded-full p-1",
                      type === "expense" ? "bg-secondary" : "bg-red-500"
                    )}
                  >
                    <Ionicons
                      name="arrow-down-outline"
                      size={16}
                      color={type === "expense" ? "#8B593E" : "white"}
                    />
                  </View>
                  <Text
                    className={cn(
                      "text-xl font-bold",
                      type === "expense" ? "text-secondary" : "text-foreground"
                    )}
                  >
                    Expense
                  </Text>
                </View>
              }
              className={cn(
                "!rounded-full flex-1 !p-2",
                type !== "expense" && "bg-secondary border border-border"
              )}
              onPress={() => setType("expense")}
            />
            <Button
              title={
                <View className="flex-row items-center gap-2">
                  <View
                    className={cn(
                      "rounded-full p-1",
                      type === "income" ? "bg-secondary" : "bg-green-500"
                    )}
                  >
                    <Ionicons
                      name="arrow-up-outline"
                      size={16}
                      color={type === "income" ? "#8B593E" : "white"}
                    />
                  </View>
                  <Text
                    className={cn(
                      "text-xl font-bold",
                      type === "income" ? "text-secondary" : "text-foreground"
                    )}
                  >
                    Income
                  </Text>
                </View>
              }
              className={cn(
                "!rounded-full flex-1 !p-2",
                type !== "income" && "bg-secondary border border-border"
              )}
              onPress={() => setType("income")}
            />
          </View>
          <View className="flex-row items-center py-4 border-b border-border">
            <Text className="text-foreground text-5xl font-bold">$</Text>
            <TextInput
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              className="text-foreground text-5xl font-bold mt-4"
              placeholderTextColor="#918A84"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-row items-center mt-5">
            <Input
              label="Transaction Title"
              value={title}
              onChangeText={setTitle}
              className="w-full"
              icon={
                <Ionicons name="create-outline" size={24} color="#918A84" />
              }
            />
          </View>

          {/* Category Section */}
          <View className="mt-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="pricetag-outline" size={16} color="#918A84" />
              <Text className="text-foreground text-lg font-semibold">
                Category
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full border",
                    selectedCategory === category.id
                      ? "bg-primary border-primary"
                      : "bg-transparent border-border"
                  )}
                >
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name={category.icon as any}
                      size={16}
                      color={
                        selectedCategory === category.id ? "white" : "#918A84"
                      }
                    />
                    <Text
                      className={cn(
                        "text-sm font-medium",
                        selectedCategory === category.id
                          ? "text-white"
                          : "text-foreground"
                      )}
                    >
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Add;
