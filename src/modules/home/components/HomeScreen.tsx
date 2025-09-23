import { MainLayout } from "@/src/components/layout/MainLayout";
import { SESSION_KEY } from "@/src/db/database";
import { getUser } from "@/src/modules/auth/server/user";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { SERVICES } from "../constants";
import { ServicesList } from "./ServicesList";

export default function HomeScreen() {
  const session = SecureStore.getItem(SESSION_KEY);
  const services = SERVICES;
  const { data: user } = useQuery({
    queryKey: ["user", session],
    queryFn: () => getUser(parseInt(session ?? "0")),
    enabled: !!session,
  });

  return (
    <MainLayout userName={user?.username}>
      <ServicesList services={services} />
    </MainLayout>
  );
}
