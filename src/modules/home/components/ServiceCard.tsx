import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

type ServiceCardProps = {
  name: string;
  description: string;
  icon: string;
  href: string;
};

export function ServiceCard({
  name,
  description,
  icon,
  href,
}: ServiceCardProps) {
  return (
    <Link href={href as any} asChild>
      <Pressable className="bg-secondary rounded-2xl p-4 mb-4 border border-muted active:opacity-80">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: "#2C3E50" + "1A" }}
            >
              <Ionicons name={icon as any} size={22} color="#2C3E50" />
            </View>
            <View>
              <Text className="text-foreground text-lg font-semibold">
                {name}
              </Text>
              <Text className="text-muted mt-0.5">{description}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
        </View>
      </Pressable>
    </Link>
  );
}
