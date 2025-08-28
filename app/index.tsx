import Transactions from "@/src/components/ui/Transactions";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";
import Button from "../src/components/ui/Button";
import StaticCard from "../src/components/ui/StaticCard";

export default function Index() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center gap-3">
          <Image
            source={require("../assets/images/logo.png")}
            className="w-16 h-16"
            resizeMode="contain"
          />
          <View>
            <Text className="text-muted text-base font-semibold">Welcome</Text>
            <Text className="text-foreground text-xl">Business Name</Text>
          </View>
        </View>

        <View className="flex-row gap-3 items-center">
          <Link href="/Add" asChild>
            <Button
              title={
                <View className="flex-row gap-2 items-center">
                  <Ionicons name="add-outline" size={20} color="white" />
                  <Text className="text-white font-medium">Add</Text>
                </View>
              }
              className="rounded-full px-4 py-2"
            />
          </Link>
          <Link href="/Login" className="p-2">
            <Ionicons name="log-out-outline" size={24} color="#8B593E" />
          </Link>
        </View>
      </View>

      <View className="p-4">
        <StaticCard />
      </View>
      <View className="p-4">
        <Transactions />
      </View>
    </View>
  );
}
