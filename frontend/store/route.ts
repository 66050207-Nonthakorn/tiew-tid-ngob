import { Route } from "@/types/routes"
import { create } from "zustand"

interface RouteStore {
  selectingRoute: Route | null;
  setSelectingRoute: (route: Route) => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  selectingRoute: null,
  setSelectingRoute: (selectingRoute: Route) => set({ selectingRoute })
}));