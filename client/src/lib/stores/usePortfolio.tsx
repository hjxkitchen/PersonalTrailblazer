import { create } from "zustand";
import type { Milestone } from "../data/journeyData";

export type PortfolioView = "main" | "extended" | "spatial";

interface PortfolioState {
  currentMilestone: Milestone | null;
  view: PortfolioView;
  isEditMode: boolean;

  // Actions
  setCurrentMilestone: (milestone: Milestone | null) => void;
  setView: (view: PortfolioView) => void;
  setEditMode: (value: boolean) => void;

  // Legacy compat (used by existing code)
  showTraditionalPortfolio: boolean;
  toggleView: () => void;
}

export const usePortfolio = create<PortfolioState>((set) => ({
  currentMilestone: null,
  view: "extended",
  showTraditionalPortfolio: true,
  isEditMode: false,

  setCurrentMilestone: (milestone) => set({ currentMilestone: milestone }),

  setView: (view) =>
    set({
      view,
      currentMilestone: null,
      showTraditionalPortfolio: view === "main",
    }),

  toggleView: () =>
    set((state) => {
      const next = state.view === "main" ? "extended" : "main";
      return { view: next, showTraditionalPortfolio: next === "main", currentMilestone: null };
    }),

  setEditMode: (value) => set({ isEditMode: value }),
}));
