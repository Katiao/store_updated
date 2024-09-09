import { Category, Company } from "./types";

export const categories: (Category | "all")[] = [
  "all",
  "Women",
  "Men",
  "Children",
  "Accessories",
] as const;

export const companies: (Company | "all")[] = [
  "all",
  "Verdant",
  "Ecoture",
  "Gaia",
  "Aether",
  "Zephyr",
] as const;
