import { View } from "react-native";
import { HomeService } from "../types";
import { ServiceCard } from "./ServiceCard";

type ServicesListProps = {
  services: HomeService[];
};

export function ServicesList({ services }: ServicesListProps) {
  return (
    <View>
      {services.map((service) => (
        <ServiceCard key={service.name} {...service} />
      ))}
    </View>
  );
}
