import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to get media URL (works for both local and production)
export function getMediaUrl(path?: string): string | null {
  if (!path) return null;
  // In production, use relative URL; in dev, use localhost
  if (import.meta.env.PROD) {
    return path; // Relative URL like /uploads/images/xxx.jpg
  }
  return `http://localhost:3001${path}`;
}
