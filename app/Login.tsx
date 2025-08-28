import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import Button from "../src/components/ui/Button";
import Input from "../src/components/ui/Input";

const Login = () => {
  const handleCreateAccount = () => {
    console.log("Create Account");
  };

  return (
    <View className="flex-1 bg-background">
      <View className="h-1/2 px-5 py-10">
        <Image
          source={require("../assets/images/revenue-i4.png")}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 px-5 gap-4">
        <Text className="text-foreground text-4xl font-bold text-center">
          Welcome Back
        </Text>
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />
        <Button title="Sign in" onPress={handleCreateAccount} />
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

export default Login;
