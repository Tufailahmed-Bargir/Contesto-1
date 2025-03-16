import { useState, useEffect, useMemo } from "react";
import {
  fetchAllContests,
  getSolutionUrl,
  getBookmarkedContests,
} from "@/lib/api";
import { Contest, FilterState } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export const useContestsData = (
  filters: FilterState,
  showOnlyBookmarked: boolean,
) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch contests
  const fetchContests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const allContests = await fetchAllContests();

      // Add solution URLs from local storage
      const contestsWithSolutions = allContests.map((contest) => ({
        ...contest,
        solutionUrl: getSolutionUrl(contest.id),
      }));

      setContests(contestsWithSolutions);

      toast({
        title: "Success",
        description: `Loaded ${contestsWithSolutions.length} contests`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error fetching contests:", error);
      setError("Failed to fetch contests. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch contests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();

    // Refresh data every 15 minutes
    const interval = setInterval(fetchContests, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter contests based on current filters
  const filteredContests = useMemo(() => {
    let filtered = contests;

    // Filter by status
    if (filters.type !== "all") {
      filtered = filtered.filter((contest) => contest.status === filters.type);
    }

    // Filter by platforms
    filtered = filtered.filter(
      (contest) => filters.platforms[contest.platform],
    );

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((contest) =>
        contest.name.toLowerCase().includes(searchLower),
      );
    }

    // Filter bookmarked
    if (showOnlyBookmarked) {
      const bookmarkedIds = getBookmarkedContests();
      filtered = filtered.filter((contest) =>
        bookmarkedIds.includes(contest.id),
      );
    }

    // Sort contests: first by status (upcoming, ongoing, completed), then by start time
    return filtered.sort((a, b) => {
      // First by status
      const statusOrder = { upcoming: 0, ongoing: 1, completed: 2 };
      const statusDiff =
        statusOrder[a.status as keyof typeof statusOrder] -
        statusOrder[b.status as keyof typeof statusOrder];

      if (statusDiff !== 0) return statusDiff;

      // Then by start time (ascending for upcoming, descending for completed)
      const aDate = new Date(a.startTime);
      const bDate = new Date(b.startTime);

      if (a.status === "completed") {
        return bDate.getTime() - aDate.getTime(); // Most recent completed first
      }

      return aDate.getTime() - bDate.getTime(); // Earliest upcoming first
    });
  }, [contests, filters, showOnlyBookmarked]);

  // Stats for each platform and status
  const stats = useMemo(() => {
    const result = {
      total: filteredContests.length,
      upcoming: 0,
      ongoing: 0,
      completed: 0,
      platforms: {
        codeforces: 0,
        codechef: 0,
        leetcode: 0,
      },
    };

    filteredContests.forEach((contest) => {
      // Count by status
      result[
        contest.status as keyof Pick<
          typeof result,
          "upcoming" | "ongoing" | "completed"
        >
      ]++;

      // Count by platform
      result.platforms[contest.platform]++;
    });

    return result;
  }, [filteredContests]);

  return {
    contests: filteredContests,
    isLoading,
    error,
    stats,
    fetchContests,
  };
};
