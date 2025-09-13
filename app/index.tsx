import Transactions from "@/src/components/ui/Transactions";
import { SESSION_KEY } from "@/src/db/database";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, Redirect, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Image, Pressable, Text, View } from "react-native";
import Button from "../src/components/ui/Button";
import StaticCard from "../src/components/ui/StaticCard";
import { getUser } from "../src/server/user";
export default function Index() {
  const session = SecureStore.getItem(SESSION_KEY);

  const { data: user } = useQuery({
    queryKey: ["user", session],
    queryFn: () => getUser(parseInt(session ?? "0")),
    enabled: !!session,
  });

  const logout = async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    router.push("/Login");
  };

  if (!session) {
    return <Redirect href="/Login" />;
  }

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
            <Text className="text-foreground text-xl">{user?.username}</Text>
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
          <Pressable className="p-2" onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#8B593E" />
          </Pressable>
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
