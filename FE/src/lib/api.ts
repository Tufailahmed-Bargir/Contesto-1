import {
  Contest,
  CodeForcesResponse,
  CodeChefResponse,
  LeetCodeResponse,
} from "./types";

const getContestStatus = (
  startTime: string,
  endTime: string,
): "upcoming" | "ongoing" | "completed" => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  return "completed";
};

export const fetchCodeForcesContests = async (): Promise<Contest[]> => {
  try {
    const response = await fetch("https://codeforces.com/api/contest.list");
    const data = (await response.json()) as CodeForcesResponse;

    if (data.status !== "OK") {
      throw new Error("Failed to fetch Codeforces contests");
    }

    const contests: Contest[] = data.result
      .filter(
        (contest) =>
          contest.phase !== "FINISHED" ||
          new Date(contest.startTimeSeconds * 1000) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      )
      .map((contest) => {
        const startTime = new Date(
          contest.startTimeSeconds * 1000,
        ).toISOString();
        const endTime = new Date(
          (contest.startTimeSeconds + contest.durationSeconds) * 1000,
        ).toISOString();
        const status = getContestStatus(startTime, endTime);

        return {
          id: `cf-${contest.id}`,
          name: contest.name,
          platform: "codeforces",
          url: `https://codeforces.com/contest/${contest.id}`,
          startTime,
          endTime,
          duration: contest.durationSeconds,
          status,
        };
      });

    return contests;
  } catch (error) {
    console.error("Error fetching CodeForces contests:", error);
    return [];
  }
};

export const fetchCodeChefContests = async (): Promise<Contest[]> => {
  try {
    const response = await fetch(
      "https://www.codechef.com/api/list/contests/all",
    );
    const data = (await response.json()) as CodeChefResponse;

    const allContests = [
      ...data.future_contests,
      ...data.present_contests,
      ...data.past_contests.slice(0, 20),
    ];

    const contests: Contest[] = allContests.map((contest) => {
      const startTime = new Date(contest.start_date).toISOString();
      const endTime = new Date(contest.end_date).toISOString();
      const duration =
        (new Date(contest.end_date).getTime() -
          new Date(contest.start_date).getTime()) /
        1000;
      const status = getContestStatus(startTime, endTime);

      return {
        id: `cc-${contest.code}`,
        name: contest.name,
        platform: "codechef",
        url: `https://www.codechef.com/${contest.code}`,
        startTime,
        endTime,
        duration,
        status,
      };
    });

    return contests;
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    return [];
  }
};

export const fetchLeetCodeContests = async (): Promise<Contest[]> => {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          {
            contestUpcomingContests {
              title
              titleSlug
              startTime
              duration
            }
            currentContests: allContests(status: STARTED) {
              title
              titleSlug
              startTime
              duration
            }
            pastContests: allContests(status: ENDED, first: 20) {
              title
              titleSlug
              startTime
              duration
            }
          }
        `,
      }),
    });

    const data = (await response.json()) as LeetCodeResponse;

    const allContests = [
      ...(data.data.contestUpcomingContests || []),
      ...(data.data.currentContests || []),
      ...(data.data.pastContests || []),
    ];

    const contests: Contest[] = allContests.map((contest) => {
      const startTime = new Date(contest.startTime * 1000).toISOString();
      const endTime = new Date(
        (contest.startTime + contest.duration) * 1000,
      ).toISOString();
      const status = getContestStatus(startTime, endTime);

      return {
        id: `lc-${contest.titleSlug}`,
        name: contest.title,
        platform: "leetcode",
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
        startTime,
        endTime,
        duration: contest.duration,
        status,
      };
    });

    return contests;
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error);
    return [];
  }
};

export const fetchContestsFromDatabase = async (): Promise<Contest[]> => {
  try {
    const response = await fetch("/api/contests");
    const data = await response.json();

    return data.map((contest: any) => ({
      id: contest.id,
      name: contest.name,
      platform: contest.platform as "codeforces" | "codechef" | "leetcode",
      url: contest.url,
      startTime: new Date(contest.startTime).toISOString(),
      endTime: new Date(contest.endTime).toISOString(),
      duration: contest.duration,
      status: contest.status as "upcoming" | "ongoing" | "completed",
      solutionUrl: contest.solution?.youtubeUrl,
    }));
  } catch (error) {
    console.error("Error fetching contests from database:", error);
    return [];
  }
};

export const fetchPastContestsFromDatabase = async (
  page: number = 1,
  limit: number = 10,
): Promise<{
  contests: Contest[];
  totalPages: number;
  currentPage: number;
  totalContests: number;
}> => {
  try {
    const response = await fetch(
      `/api/contests/past?page=${page}&limit=${limit}`,
    );
    const data = await response.json();

    return {
      contests: data.contests.map((contest: any) => ({
        id: contest.id,
        name: contest.name,
        platform: contest.platform as "codeforces" | "codechef" | "leetcode",
        url: contest.url,
        startTime: new Date(contest.startTime).toISOString(),
        endTime: new Date(contest.endTime).toISOString(),
        duration: contest.duration,
        status: contest.status as "upcoming" | "ongoing" | "completed",
        solutionUrl: contest.solution?.youtubeUrl,
      })),
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      totalContests: data.totalContests,
    };
  } catch (error) {
    console.error("Error fetching past contests from database:", error);
    return {
      contests: [],
      totalPages: 0,
      currentPage: 1,
      totalContests: 0,
    };
  }
};

export const fetchAllContests = async (): Promise<Contest[]> => {
  try {
    const databaseContests = await fetchContestsFromDatabase();

    if (databaseContests.length > 0) {
      return databaseContests;
    }

    const [codeforces, codechef, leetcode] = await Promise.all([
      fetchCodeForcesContests(),
      fetchCodeChefContests(),
      fetchLeetCodeContests(),
    ]);

    return [...codeforces, ...codechef, ...leetcode];
  } catch (error) {
    console.error("Error fetching all contests:", error);

    const [codeforces, codechef, leetcode] = await Promise.all([
      fetchCodeForcesContests(),
      fetchCodeChefContests(),
      fetchLeetCodeContests(),
    ]);

    return [...codeforces, ...codechef, ...leetcode];
  }
};

export const syncContestsToDatabase = async (): Promise<void> => {
  try {
    await fetch("/api/sync-contests", { method: "POST" });
  } catch (error) {
    console.error("Error synchronizing contests to database:", error);
    throw error;
  }
};

export const isBookmarked = (contestId: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const bookmarks = localStorage.getItem("bookmarks");
    if (!bookmarks) return false;

    const bookmarkList = JSON.parse(bookmarks) as string[];
    return bookmarkList.includes(contestId);
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
};

export const addBookmark = (contestId: string): void => {
  try {
    const bookmarks = localStorage.getItem("bookmarks");
    let bookmarkList = bookmarks ? (JSON.parse(bookmarks) as string[]) : [];

    if (!bookmarkList.includes(contestId)) {
      bookmarkList.push(contestId);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
    }
  } catch (error) {
    console.error("Error adding bookmark:", error);
  }
};

export const removeBookmark = (contestId: string): void => {
  try {
    const bookmarks = localStorage.getItem("bookmarks");
    if (!bookmarks) return;

    let bookmarkList = JSON.parse(bookmarks) as string[];
    bookmarkList = bookmarkList.filter((id) => id !== contestId);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
  } catch (error) {
    console.error("Error removing bookmark:", error);
  }
};

export const getSolutionUrl = (
  contestId: string,
): string | null | undefined => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const solutions = localStorage.getItem("solutions");
    if (solutions) {
      const solutionsMap = JSON.parse(solutions);
      return solutionsMap[contestId];
    }
    return null;
  } catch (error) {
    console.error("Error getting solution URL from local storage:", error);
    return null;
  }
};

export const saveSolutionUrl = (
  contestId: string,
  solutionUrl: string,
): void => {
  try {
    let solutions = localStorage.getItem("solutions");
    let solutionsMap = solutions ? JSON.parse(solutions) : {};

    solutionsMap[contestId] = solutionUrl;

    localStorage.setItem("solutions", JSON.stringify(solutionsMap));
  } catch (error) {
    console.error("Error saving solution URL to local storage:", error);
  }
};

export const getBookmarkedContests = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const bookmarks = localStorage.getItem("bookmarks");
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error(
      "Error getting bookmarked contests from local storage:",
      error,
    );
    return [];
  }
};

export const saveBookmarkedContests = (contestIds: string[]): void => {
  try {
    localStorage.setItem("bookmarks", JSON.stringify(contestIds));
  } catch (error) {
    console.error("Error saving bookmarked contests to local storage:", error);
  }
};
