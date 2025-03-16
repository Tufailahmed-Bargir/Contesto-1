export interface Contest {
  id: string;
  name: string;
  platform: "codeforces" | "codechef" | "leetcode";
  url: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  duration: number; // in seconds
  status: "upcoming" | "ongoing" | "completed";
  solutionUrl?: string; // YouTube solution link
}

export interface Platform {
  id: "codeforces" | "codechef" | "leetcode";
  name: string;
  color: string;
  icon: string;
  enabled: boolean;
}

export type FilterType = "all" | "upcoming" | "ongoing" | "completed";

export interface FilterState {
  type: FilterType;
  platforms: {
    codeforces: boolean;
    codechef: boolean;
    leetcode: boolean;
  };
  search: string;
}

// CodeForces API types
export interface CodeForcesResponse {
  status: string;
  result: CodeForcesContest[];
}

export interface CodeForcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
}

// CodeChef API types
export interface CodeChefResponse {
  future_contests: CodeChefContest[];
  present_contests: CodeChefContest[];
  past_contests: CodeChefContest[];
}

export interface CodeChefContest {
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  url: string;
}

// LeetCode API types
export interface LeetCodeResponse {
  data: {
    contestUpcomingContests: LeetCodeContest[];
    currentContests: LeetCodeContest[];
    pastContests: LeetCodeContest[];
  };
}

export interface LeetCodeContest {
  containsPremium: boolean;
  title: string;
  cardImg: string;
  titleSlug: string;
  startTime: number;
  duration: number;
  originStartTime: number;
  isVirtual: boolean;
}
