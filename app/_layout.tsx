import { FullScreenLoading } from "@/src/components/ui/Loading";
import { DATABASE_NAME } from "@/src/db/database";
import { useDatabaseSetup } from "@/src/db/migrations/setupMigrations";
import { QueryProvider } from "@/src/providers/QueryProvider";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
export default function RootLayout() {
  const { isLoading, migrationError, success } = useDatabaseSetup();

  if (migrationError) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              color: "red",
            }}
          >
            Database Migration Error
          </Text>
          <Text style={{ textAlign: "center", marginBottom: 20 }}>
            {migrationError}
          </Text>
          <Text style={{ fontSize: 12, color: "gray", textAlign: "center" }}>
            Try clearing the app data or reinstalling the app to reset the
            database.
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <FullScreenLoading message="Setting up database..." />
      </SafeAreaProvider>
    );
  }

  if (!success) {
    return (
      <SafeAreaProvider>
        <FullScreenLoading message="Initializing..." />
      </SafeAreaProvider>
    );
  }

  return (
    <QueryProvider>
      <Suspense fallback={<FullScreenLoading message="Loading app..." />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense={true}
        >
          <SafeAreaProvider style={{ marginTop: 20 }}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="light-content"
            />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="Login" />
              <Stack.Screen name="Verify" />
              <Stack.Screen name="Signup" />
            </Stack>
          </SafeAreaProvider>
        </SQLiteProvider>
      </Suspense>
    </QueryProvider>
  );
}
