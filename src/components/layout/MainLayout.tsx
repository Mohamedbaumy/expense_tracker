import { ReactNode } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "./AppHeader";

type MainLayoutProps = {
  userName?: string;
  actions?: {
    icon: string;
    onPress: () => void;
    color?: string;
    size?: number;
    testID?: string;
  }[];
  children: ReactNode;
};

export function MainLayout({ userName, actions, children }: MainLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader userName={userName} actions={actions} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
