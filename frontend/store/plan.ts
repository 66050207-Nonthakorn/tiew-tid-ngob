import { create } from "zustand"
import { Plan } from "@/types/plan";

interface PlanStore {
  selectingPlan: Plan | null
  setSelectingPlan: (plan: Plan) => void
  finishedCheckpoints: number[]
  setFinishedCheckpoints: (checkpoints: number[]) => void
  clearPlan: () => void
}

export const usePlanStore = create<PlanStore>((set) => ({
  selectingPlan: null,
  finishedCheckpoints: [],
  setSelectingPlan: (plan: Plan) => {
    set({ selectingPlan: plan });
  },
  setFinishedCheckpoints: (checkpoints: number[]) => {
    set({ finishedCheckpoints: checkpoints });
  },
  clearPlan: () => {
    set({ selectingPlan: null, finishedCheckpoints: [] })
  }
}));