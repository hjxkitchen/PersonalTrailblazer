import { create } from "zustand";
import type { Milestone } from "../data/journeyData";

interface PortfolioState {
  currentMilestone: Milestone | null;
  showTraditionalPortfolio: boolean;
  
  // Actions
  setCurrentMilestone: (milestone: Milestone | null) => void;
  toggleView: () => void;
}

export const usePortfolio = create<PortfolioState>((set) => ({
  currentMilestone: null,
  showTraditionalPortfolio: true,
  
  setCurrentMilestone: (milestone) => set({ currentMilestone: milestone }),
  toggleView: () => set((state) => ({ 
    showTraditionalPortfolio: !state.showTraditionalPortfolio,
    currentMilestone: null // Clear milestone when switching views
  })),
}));
