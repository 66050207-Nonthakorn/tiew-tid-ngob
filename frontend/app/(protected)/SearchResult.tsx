import RouteCard from "@/components/ui/RouteCard";
import { Text } from "@/components/ui/Text"
import { Route } from "@/types/routes";
import { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useUserLocation } from "@/hooks/useUserLocation";
import { fetchPlan } from "@/lib/plan";

type SearchResultParams = {
  budget: string,
}

export default function SearchResult() {
  const searchParams = useLocalSearchParams<SearchResultParams>();
  const budget = parseInt(searchParams.budget);

  const { userLocation } = useUserLocation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchedRoutes, setFetchedRoutes] = useState<Route[]>([]);
  
  useEffect(() => {  
    if (!userLocation) return;

    (async () => {
      setIsLoading(true);

      const routes = await fetchPlan(budget, userLocation);
      if (routes) {
        setFetchedRoutes(routes);
      }

      setIsLoading(false);
    })();

  }, [budget, userLocation]);
  
  return (
    <View className="flex-1 gap-4 p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="mb-2">
          ผลการค้นหา
        </Text>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#111111"
          />
        ) : (
          <View className="flex flex-col gap-4">
            {fetchedRoutes.map((route, index) => 
              <RouteCard
                key={index}
                index={index}
                route={route}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
