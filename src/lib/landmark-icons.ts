import {
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Plane,
  HeartPulse,
  Trees,
} from "lucide-react";
import type { LandmarkCategory } from "./types";

/* Kept in a neutral (non-"use client") module so both server and client
   components can import the real map — importing it from a client module
   would hand server components a client reference, not the icons. */
export const categoryIcon: Record<LandmarkCategory, typeof Briefcase> = {
  Work: Briefcase,
  Education: GraduationCap,
  Retail: ShoppingBag,
  Transport: Plane,
  Health: HeartPulse,
  Leisure: Trees,
};
