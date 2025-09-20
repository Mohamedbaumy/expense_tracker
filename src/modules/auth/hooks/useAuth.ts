import { SESSION_KEY } from "@/src/db/database";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { login, registerUser } from "../server/user";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to login");
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      Alert.alert("Success", "Account created successfully! Please login.");
      router.push("/Login");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to create account");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    queryClient.clear();
    router.push("/Login");
  };
};

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => SecureStore.getItemAsync(SESSION_KEY),
    retry: false,
  });
};
