import Maps from "@/components/ui/maps/Maps";
import { useEffect } from "react";
import { View } from "react-native";
import { fetch } from "expo/fetch";

export default function PlanPage() {

  useEffect(() => {
    
    (async () => {
      const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
        headers: {
          "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
          "X-Goog-FieldMask": "routes.*",
        },
        method: "POST",
        body: JSON.stringify({
          origin:{
            address: "Faculty of Engineering, KMITL, เลขที่1 Chalong Krung 1 Alley, Lat Krabang, Bangkok 10520"
          },
          destination:{
            address: "V Market, 31, 127 Thanon Chalong Krung, Lam Pla Thio, Lat Krabang, Bangkok 10520"
          },
          travelMode: "TRANSIT"
        }),
      }); 

      const data = await res.json();
      console.log(JSON.stringify(data.routes, null, 2));
      
    })();

  }, []);

  return (
    <View className="size-full">
      <Maps />
    </View>
  );
}
