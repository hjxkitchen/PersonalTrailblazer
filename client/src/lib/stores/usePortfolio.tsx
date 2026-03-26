import { create } from "zustand";
import type { Milestone } from "../data/journeyData";

interface PortfolioState {
  currentMilestone: Milestone | null;
  showTraditionalPortfolio: boolean;
  isEditMode: boolean;

  // Actions
  setCurrentMilestone: (milestone: Milestone | null) => void;
  toggleView: () => void;
  setEditMode: (value: boolean) => void;
}

export const usePortfolio = create<PortfolioState>((set) => ({
  currentMilestone: null,
  showTraditionalPortfolio: true,
  isEditMode: false,

  setCurrentMilestone: (milestone) => set({ currentMilestone: milestone }),
  toggleView: () => set((state) => ({
    showTraditionalPortfolio: !state.showTraditionalPortfolio,
    currentMilestone: null
  })),
  setEditMode: (value) => set({ isEditMode: value }),
}));
