import type { Pkg, Region, Vibe } from "./data";

export type Filters = {
  vibe: Vibe | "all";
  month: number | "all";
  budget: number;
};

export const BUDGET_MIN = 10000;
export const BUDGET_MAX = 250000;

export const defaultFilters: Filters = { vibe: "all", month: "all", budget: BUDGET_MAX };

export function matchesFilters(p: Pkg, f: Filters, region: Region | "all" = "all") {
  if (region !== "all" && p.region !== region) return false;
  if (f.vibe !== "all" && !p.vibes.includes(f.vibe)) return false;
  if (f.month !== "all" && !p.months.includes(f.month)) return false;
  if (p.price > f.budget) return false;
  return true;
}

export const isFiltered = (f: Filters) => f.vibe !== "all" || f.month !== "all" || f.budget < BUDGET_MAX;
