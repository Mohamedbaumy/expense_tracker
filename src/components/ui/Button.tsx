import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string | React.ReactNode;
  [key: string]: any;
}

const Button = ({ title, className, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-primary rounded-xl p-4 ${className}`}
      {...props}
    >
      <Text className="text-secondary text-lg font-bold text-center">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
