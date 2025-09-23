import { SESSION_KEY } from "@/src/db/database";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const session = SecureStore.getItem(SESSION_KEY);

  if (!session) {
    return <Redirect href="/Login" />;
  }

  return <Redirect href="/(tabs)" />;
}
