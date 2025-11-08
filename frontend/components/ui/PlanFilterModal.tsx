import { Modal, Pressable, View } from "react-native"
import { ComponentProps, useState } from "react"
import { FontAwesome5, Entypo } from "@expo/vector-icons"
import { PlanFilter } from "@/types/plan";
import { Text } from "./Text";

interface PlanFilterProps extends ComponentProps<typeof Pressable> {
  onSelectFilter: (filter: PlanFilter) => void
}

export default function PlanFilterModal({ onSelectFilter, ...props }: PlanFilterProps) {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [selectingFilter, setSelectingFilter] = useState<PlanFilter>("price:asc");

  const filterAndLabel: Record<PlanFilter, string> = {
    "places:asc": "Sort by total places low to high",
    "places:desc": "Sort by total places high to low",
    "price:asc": "Sort by price low to high",
    "price:desc": "Sort by price high to low",
    "distance:asc": "Sort by distance shortest to longest",
    "distance:desc": "Sort by distance longest to shortest"
  }

  return (
    <Pressable
      {...props}
      onPress={() => setIsShowModal(true)}
    >
      <FontAwesome5
        name="filter"
        size={22}
      />
      <Modal
        visible={isShowModal}
        animationType="slide"
        className="relative"
      >
        <View className="w-full p-4">
          <Pressable onPress={() => setIsShowModal(false)}>
            <Entypo
              name="cross"
              size={36}
              className="self-end"
            />
          </Pressable>
        </View>

        <View className="px-6 gap-1">
          <Text className="text-lg mb-2">
            Sorting
          </Text>

          {Object.entries(filterAndLabel).map(([filter, label]) =>
            <Pressable
              key={filter}
              onPress={() => setSelectingFilter(filter as PlanFilter)}
              className={`items-center py-3 ${selectingFilter === filter ? "bg-blue-500" : "border border-zinc-300"}`}
            >
              <Text weight="semibold" className={selectingFilter === filter ? "text-white" : ""}>
                {label}
              </Text>
            </Pressable>
          )}
        </View>

        <View className="absolute bottom-0 w-full p-8 px-4 flex-row gap-2">
          <Pressable
            onPress={() => setIsShowModal(false)}
            className="w-1/2 items-center border border-zinc-300 py-2"
          >
            <Text weight="semibold" className="text-lg">
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onSelectFilter(selectingFilter);
              setIsShowModal(false);
            }}
            className="w-1/2 items-center bg-blue-500 py-2"
          >
            <Text weight="bold" className="text-white text-lg">
              Filter
            </Text>
          </Pressable>
        </View>
      </Modal>
    </Pressable>
  )
}