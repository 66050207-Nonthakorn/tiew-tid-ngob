import { ComponentProps } from "react"
import { Text as NativeText } from "react-native"

type FontWeight = "regular" | "light" | "semibold" | "bold";

const fontByWeight: Record<FontWeight, string> =  {
  regular:  "NunitoSans",
  light:    "NunitoSansLight",
  semibold: "NunitoSansSemiBold",
  bold:     "NunitoSansBold"
}

interface TextProps extends ComponentProps<typeof NativeText> {
  weight?: FontWeight
}

export function Text({ weight = "regular", ...props }: TextProps) {
  return (
    <NativeText
      {...props}
      style={{ fontFamily: fontByWeight[weight]  }}
    />
  )
}
