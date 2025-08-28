import React from "react";
import { Text, View } from "react-native";
import Button from "../src/components/ui/Button";
import Input from "../src/components/ui/Input";

const Login = () => {
  const handleVerify = () => {
    console.log("Verify");
  };

  return (
    <View className="flex-1 bg-background justify-center items-center gap-4 px-5">
      <Text className="text-foreground text-4xl font-bold text-center">
        Verify your email
      </Text>
      <Input
        label="Verification Code"
        type="number"
        className="w-full text-center"
      />
      <Button title="Verify Email" onPress={handleVerify} />
    </View>
  );
};

export default Login;
