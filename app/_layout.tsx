import {
  DATABASE_NAME,
  useDatabaseSetup,
} from "@/src/db/migrations/setupMigrations";
import { QueryProvider } from "@/src/providers/QueryProvider";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const { db, isLoading, migrationError, success } = useDatabaseSetup();

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

  // Show loading while migrations are running
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Setting up database...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Only proceed if migrations are successful
  if (!success || !db) {
    return (
      <SafeAreaProvider>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Initializing...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <QueryProvider>
      <Suspense fallback={<ActivityIndicator size="large" />}>
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
              <Stack.Screen name="Login" />
              <Stack.Screen name="Verify" />
              <Stack.Screen name="Signup" />
              <Stack.Screen name="Add" />
            </Stack>
          </SafeAreaProvider>
        </SQLiteProvider>
      </Suspense>
    </QueryProvider>
  );
}
