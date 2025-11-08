import PlanCard from "@/components/ui/PlanCard";
import { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useUserLocation } from "@/hooks/useUserLocation";
import { fetchPlan } from "@/lib/plan";
import { Plan, PlanFilter } from "@/types/plan";
import { Text } from "@/components/ui/Text";
import PlanFilterModal from "@/components/ui/PlanFilterModal";
import { Ionicons } from "@expo/vector-icons";

type SearchResultParams = {
  budget: string,
}

export default function SearchResult() {
  const searchParams = useLocalSearchParams<SearchResultParams>();
  const { userLocation } = useUserLocation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planFilter, setPlanFilter] = useState<PlanFilter | null>(null);

  const budget = parseInt(searchParams.budget);
  
  useEffect(() => {  
    if (!userLocation || plans.length !== 0) return;

    (async () => {
      setIsLoading(true);
      const generatedPlans = await fetchPlan(budget, userLocation);
      if (generatedPlans) {
        setPlans(generatedPlans);
      }
      setIsLoading(false);
    })();

  }, [budget, plans.length, userLocation]);

  const plansWithMetadata = plans.map((plan, index) => {
    const distance = plan.legs.reduce((acc, leg) => acc + (leg.distanceMeters || 0), 0);
    const price = Math.round(20 * distance / 1000);
    return { ...plan, distance, price, index };
  });

  const filteredPlans = (planFilter 
    ? plansWithMetadata.sort((a, b) => {
      switch (planFilter) {
        case "places:asc":    return a.placeNames.length - b.placeNames.length
        case "places:desc":   return b.placeNames.length - a.placeNames.length
        case "price:asc":     return a.price - b.price
        case "price:desc":    return b.price - a.price
        case "distance:asc":  return a.distance - b.distance
        case "distance:desc": return b.distance - a.distance
      }
    })
    : plansWithMetadata
  );

  return (
    <View className="flex-1 gap-4 p-4 bg-white">
      <View className="flex-row p-2 items-center justify-between w-full">
        <View className="flex-row gap-4 items-center">
          <Ionicons
            name="arrow-back"
            size={22}
          />
          <Text weight="bold" className="text-2xl">
            Search result
          </Text>
        </View>
        <PlanFilterModal
          onSelectFilter={(filter) => setPlanFilter(filter)}
          className="justify-self-end"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#111111"
          />
        ) : (
          <View className="flex flex-col gap-4">
            {filteredPlans.map((plan) => 
              <PlanCard
                key={plan.index}
                index={plan.index}
                plan={plan}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
