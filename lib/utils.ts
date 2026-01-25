import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { techMap } from "../constants/techMap"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();  // This is just to clean up the techName, repalcing spaces and dots for empty string and lowecasing it


  return techMap[normalizedTechName] 
        ? `${techMap[normalizedTechName]} colored` 
        : "devicon-devicon-plain";
}
