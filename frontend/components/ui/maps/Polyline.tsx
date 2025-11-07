import { Polyline as RNPolyline } from "react-native-maps";
import { StyleProp, ViewStyle } from "react-native";
import { LatLng, TravelMode } from "@/types/routes";

interface PolylineProps {
  coordinates: LatLng[];
  travelMode?: TravelMode;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  strokeColor?: string
}

const travelModeStyles: Record<TravelMode, {
  strokeColor: string;
  strokeWidth: number;
  lineDashPattern?: number[];
}> = {
  TRANSIT: {
    strokeColor: "#4285F4",
    strokeWidth: 4,
  },
  WALK: {
    strokeColor: "#666666",
    strokeWidth: 5,
    lineDashPattern: [10, 20], // Dashed line for walking
  },
  DRIVE: {
    strokeColor: "#EA4335",
    strokeWidth: 4,
  },
  BICYCLE: {
    strokeColor: "#FBBC05",
    strokeWidth: 3,
    lineDashPattern: [10, 5], // Long dash for cycling
  },
};

export default function Polyline({ 
  coordinates, 
  travelMode = "DRIVE",
  style,
  selected = false,
  strokeColor
}: PolylineProps) {
  const baseStyle = travelModeStyles[travelMode];
  
  return (
    <RNPolyline
      coordinates={coordinates}
      strokeColor={strokeColor ?? baseStyle.strokeColor}
      strokeWidth={baseStyle.strokeWidth}
      lineDashPattern={baseStyle.lineDashPattern}
      zIndex={selected ? 2 : 1}
      style={style}
    />
  );
}
