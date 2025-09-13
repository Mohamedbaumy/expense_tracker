import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

interface LoadingProps {
  variant?: "spinner" | "skeleton" | "pulse" | "dots" | "minimal";
  size?: "small" | "medium" | "large";
  message?: string;
  showMessage?: boolean;
  className?: string;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = "spinner",
  size = "medium",
  message = "Loading...",
  showMessage = true,
  className = "",
  color = "#8B593E",
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const dotValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (variant === "spinner") {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
      return () => spinAnimation.stop();
    }

    if (variant === "pulse") {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }

    if (variant === "dots") {
      const createDotAnimation = (dotValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dotValue, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dotValue, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animations = dotValues.map((dotValue, index) =>
        createDotAnimation(dotValue, index * 200)
      );

      animations.forEach((animation) => animation.start());
      return () => animations.forEach((animation) => animation.stop());
    }
  }, [variant, spinValue, pulseValue, dotValues]);

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return { container: "p-4", icon: 20, text: "text-sm" };
      case "large":
        return { container: "p-8", icon: 40, text: "text-lg" };
      default:
        return { container: "p-6", icon: 30, text: "text-base" };
    }
  };

  const sizeClasses = getSizeClasses();

  const renderSpinner = () => {
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <Animated.View
        style={{
          transform: [{ rotate: spin }],
        }}
      >
        <Ionicons name="refresh" size={sizeClasses.icon} color={color} />
      </Animated.View>
    );
  };

  const renderPulse = () => {
    return (
      <Animated.View
        style={{
          transform: [{ scale: pulseValue }],
        }}
        className="bg-primary rounded-full"
      >
        <View
          className="rounded-full"
          style={{
            width: sizeClasses.icon,
            height: sizeClasses.icon,
            backgroundColor: color,
          }}
        />
      </Animated.View>
    );
  };

  const renderDots = () => {
    return (
      <View className="flex-row items-center space-x-2">
        {dotValues.map((dotValue, index) => {
          const opacity = dotValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          });

          return (
            <Animated.View
              key={index}
              style={{
                opacity,
                transform: [
                  {
                    scale: dotValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              }}
              className="rounded-full"
            >
              <View
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: color,
                }}
              />
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const renderSkeleton = () => {
    return (
      <View className="space-y-3">
        <View className="bg-border rounded-xl h-4 w-32 animate-pulse" />
        <View className="bg-border rounded-xl h-4 w-24 animate-pulse" />
        <View className="bg-border rounded-xl h-4 w-28 animate-pulse" />
      </View>
    );
  };

  const renderMinimal = () => {
    return (
      <View className="flex-row items-center space-x-2">
        <View
          className="rounded-full animate-pulse"
          style={{
            width: 6,
            height: 6,
            backgroundColor: color,
          }}
        />
        <View
          className="rounded-full animate-pulse"
          style={{
            width: 6,
            height: 6,
            backgroundColor: color,
          }}
        />
        <View
          className="rounded-full animate-pulse"
          style={{
            width: 6,
            height: 6,
            backgroundColor: color,
          }}
        />
      </View>
    );
  };

  const renderLoadingContent = () => {
    switch (variant) {
      case "skeleton":
        return renderSkeleton();
      case "pulse":
        return renderPulse();
      case "dots":
        return renderDots();
      case "minimal":
        return renderMinimal();
      default:
        return renderSpinner();
    }
  };

  return (
    <View
      className={`flex-1 justify-center items-center bg-background ${sizeClasses.container} ${className}`}
    >
      <View className="items-center space-y-4">
        {renderLoadingContent()}
        {showMessage && message && (
          <Text
            className={`text-muted font-medium ${sizeClasses.text} text-center`}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

// Specialized loading components for common use cases
export const FullScreenLoading: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <Loading
    variant="spinner"
    size="large"
    message={message}
    className="absolute inset-0 z-50"
  />
);

export const InlineLoading: React.FC<{ message?: string }> = ({ message }) => (
  <Loading
    variant="minimal"
    size="small"
    message={message}
    showMessage={false}
    className="py-2"
  />
);

export const CardLoading: React.FC = () => (
  <View className="bg-white p-6 rounded-2xl shadow-sm border border-border">
    <Loading variant="skeleton" showMessage={false} />
  </View>
);

export const ButtonLoading: React.FC<{
  size?: "small" | "medium" | "large";
}> = ({ size = "small" }) => (
  <Loading variant="dots" size={size} showMessage={false} className="py-1" />
);

export default Loading;
