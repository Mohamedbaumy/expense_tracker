import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  error?: string;
  [key: string]: any;
}

const Input = ({ label, icon, className, error, ...props }: InputProps) => {
  return (
    <View className={`relative ${className}`}>
      <TextInput
        placeholder={label}
        className={`border border-border rounded-xl p-4 pl-12 text-lg bg-secondary placeholder:text-muted ${className}`}
        secureTextEntry={props.type === "password"}
        {...props}
      />
      {icon && (
        <View className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {icon}
        </View>
      )}
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </View>
  );
};

export default Input;
