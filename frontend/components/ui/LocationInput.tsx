import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps, useState } from "react";
import { View, TouchableOpacity, Modal, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "./Text";
import { useUserLocation } from "@/hooks/useUserLocation";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { LatLng, Region } from "react-native-maps";

interface LocationInputProps extends ComponentProps<typeof TouchableOpacity> {
  placeholder: string;
  onLocationSelected: (location?: LatLng) => void
}

export function LocationInput({ placeholder, onLocationSelected, className }: LocationInputProps) {
  const { userLocation, isLoading } = useUserLocation();

  const [selectingLocation, setSelectingLocation] = useState<LatLng | null>(null);
  const [isShowMapSelector, setIsShowMapSelector] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(false);

  async function fetchLocationName(location: LatLng) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setLocationName(data.results[0].formatted_address);
      }
    }
    catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  return (
    <TouchableOpacity
      disabled={isLoading}
      onPressIn={() => setIsShowMapSelector(true)}
      className={className}
    >
      <View className="flex-row items-center border-2 border-zinc-300 rounded-full overflow-hidden px-4">
        
        <TextInput
          style={{ fontFamily: "NunitoSans" }}
          placeholder={isFetchingLocation ? "Loading..." : placeholder}
          value={locationName}
          editable={false}
          selection={{ start: 0 }}
          className="flex-1 text-start align-top"
        />
        
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Ionicons
            name="location"
            size={24}
            color="#71717a"
          />
        )}
      </View>

      <MapSelector
        isVisible={isShowMapSelector}
        onClose={() => setIsShowMapSelector(false)}
        onSelectLocation={async (location) => {
          setIsFetchingLocation(true);

          if (location) {
            setSelectingLocation(location);
            await fetchLocationName(location);
          }

          onLocationSelected(location);
          setIsFetchingLocation(false);
        }}
        initialRegion={selectingLocation || userLocation || undefined}
      />
    </TouchableOpacity>
  );
}

interface MapSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectLocation: (location?: LatLng) => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
  };
}

function MapSelector({
  isVisible,
  onClose,
  onSelectLocation,
  initialRegion
}: MapSelectorProps) {
  
  const [selectedLocation, setSelectedLocation] = useState(initialRegion);

  function handleRegionChangeComplete(region: Region) {
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1">
        <View className="p-4 flex-row items-center justify-between border-b border-zinc-200">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-blue-500">Cancel</Text>
          </TouchableOpacity>
          <Text weight="semibold" className="text-lg">Select Location</Text>
          <TouchableOpacity onPressIn={async () => {
            onSelectLocation(selectedLocation);
            onClose();
          }}>
            <Text className="text-blue-500">Done</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center">
          <MapView
            initialRegion={initialRegion ? {
              ...initialRegion,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            } : undefined}
            onRegionChangeComplete={handleRegionChangeComplete}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons
            name="location"
            size={24}
            color="#FF0000"
            className="mb-6"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}