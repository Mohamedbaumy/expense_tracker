import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

type HeaderAction = {
  icon: string;
  onPress: () => void;
  color?: string;
  size?: number;
  testID?: string;
};

type AppHeaderProps = {
  userName?: string;
  actions?: HeaderAction[]; // up to 2 actions rendered on the right
};

export function AppHeader({ userName, actions = [] }: AppHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-3">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-16 h-16"
          resizeMode="contain"
        />
        <View>
          <Text className="text-muted text-base font-semibold">Welcome</Text>
          <Text className="text-foreground text-2xl font-bold">{userName}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {actions.slice(0, 2).map((action, idx) => (
          <Pressable
            key={action.testID ?? idx}
            onPress={action.onPress}
            className="p-2"
            testID={action.testID}
          >
            <Ionicons
              name={action.icon as any}
              size={action.size ?? 22}
              color={action.color ?? "#2C3E50"}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
