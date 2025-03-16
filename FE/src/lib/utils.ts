import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  formatDistance,
  formatDistanceToNow,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import { Contest } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date in a readable format
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "PPP");
}

// Format time in a readable format
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "p");
}

// Format date and time in a readable format
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "PPp");
}

// Get time remaining until a date
export function getTimeRemaining(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (isBefore(dateObj, new Date())) {
    return "Started";
  }
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Format duration in a readable format (hours and minutes)
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

// Determine contest status based on start and end times
export function getContestStatus(
  contest: Contest,
): "upcoming" | "ongoing" | "completed" {
  const now = new Date();
  const startTime = parseISO(contest.startTime);
  const endTime = parseISO(contest.endTime);

  if (isBefore(now, startTime)) {
    return "upcoming";
  }

  if (isAfter(now, endTime)) {
    return "completed";
  }

  return "ongoing";
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

// Format platform name for display
export function formatPlatformName(platform: string): string {
  switch (platform) {
    case "codeforces":
      return "Codeforces";
    case "codechef":
      return "CodeChef";
    case "leetcode":
      return "LeetCode";
    default:
      return platform;
  }
}

// Get platform color
export function getPlatformColor(platform: string): string {
  switch (platform) {
    case "codeforces":
      return "bg-codeforces text-white";
    case "codechef":
      return "bg-codechef text-white";
    case "leetcode":
      return "bg-leetcode text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

// Get platform tag class
export function getPlatformTagClass(platform: string): string {
  switch (platform) {
    case "codeforces":
      return "platform-tag-codeforces";
    case "codechef":
      return "platform-tag-codechef";
    case "leetcode":
      return "platform-tag-leetcode";
    default:
      return "";
  }
}
