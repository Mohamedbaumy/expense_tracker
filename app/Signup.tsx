import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import Button from "../src/components/ui/Button";
import Input from "../src/components/ui/Input";
import { registerUser } from "../src/server/user";

type Inputs = {
  username: string;
  password: string;
};

const Signup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutate: createUserMutation } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push("/Login");
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      createUserMutation(data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-1/2 px-5 py-10">
        <Image
          source={require("../assets/images/revenue-i2.png")}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 px-5 gap-4">
        <Text className="text-foreground text-4xl font-bold text-center">
          Create Account
        </Text>
        <Controller
          control={control}
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Username"
              type="text"
              value={value}
              onChangeText={onChange}
              error={errors.username?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              type="password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />
        <Button title="Sign up" onPress={handleSubmit(onSubmit)} />
        <Text className="text-foreground text-center text-base">
          Already have an account?{" "}
          <Link href="/Login">
            <Text className="text-primary text-center text-base">Sign in</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default Signup;
