import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { FullScreenLoading } from "@/src/components/ui/Loading";
import { SESSION_KEY } from "@/src/db/database";
import { usersTable } from "@/src/db/schema";
import { Link, Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { useLogin } from "../hooks/useAuth";
import { LoginFormData } from "../types";

export const Login: React.FC = () => {
  const session = SecureStore.getItem(SESSION_KEY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { mutate: loginMutation, isPending, isPaused } = useLogin();

  const handleCreateAccount: SubmitHandler<LoginFormData> = (data) => {
    setIsLoading(true);
    loginMutation(data as typeof usersTable.$inferSelect);
  };

  if (session) {
    return <Redirect href="/" />;
  }

  if (isPending || isPaused || isLoading) {
    return <FullScreenLoading message="Logging in..." />;
  }

  return (
    <View className="flex-1 bg-background">
      <View className="h-1/2 px-5 py-10">
        <Image
          source={require("../../../../assets/images/revenue-i4.png")}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 px-5 gap-4">
        <Text className="text-foreground text-4xl font-bold text-center">
          Welcome Back
        </Text>
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <Input
              label="Username"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.username?.message}
              keyboardType="default"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              label="Password"
              type="password"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.password?.message}
              keyboardType="default"
            />
          )}
        />
        <Button title="Sign in" onPress={handleSubmit(handleCreateAccount)} />
        <Text className="text-foreground text-center text-base">
          Don&apos;t have an account?{" "}
          <Link href="/Signup">
            <Text className="text-primary text-center text-base">Sign up</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
};
