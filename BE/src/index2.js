import axios from "axios";
import { prisma } from "./lib/prisma.js";
// import { prisma } from "@/lib/prisma"; // Ensure this path points to your Prisma client

const getRelativeTime = (startTime, now) => {
  const diff = startTime.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return diff > 0 ? `Starts in ${hours} hr ${minutes} min` : "Started";
};

const formatContest = (
  contest,
  platform,
  startTime,
  endTime,
  durationMinutes,
  url,
) => {
  const now = new Date();
  const status =
    now < startTime ? "Upcoming" : now <= endTime ? "Ongoing" : "Finished";
  const durationHours = Math.floor(durationMinutes / 60);
  const remainingMinutes = durationMinutes % 60;
  const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };

  return {
    name: contest.name || contest.contest_name || contest.title,
    platform,
    date: startTime.toLocaleDateString("en-US", dateOptions),
    time: startTime.toLocaleTimeString("en-US", timeOptions),
    duration: formattedDuration,
    status,
    relativeTime: getRelativeTime(startTime, now),
    url,
  };
};

const fetchContests = async (url, platform, type, limit) => {
  try {
    const response = await axios.get(url);
    return response.data[type].slice(0, limit).map((contest) => {
      const startTime = new Date(
        contest.contest_start_date_iso || contest.startTimeSeconds * 1000,
      );
      const endTime = new Date(
        startTime.getTime() +
          parseInt(contest.contest_duration || contest.durationSeconds) * 1000,
      );
      const contestUrl =
        platform === "CodeChef"
          ? `https://www.codechef.com/${contest.contest_code}`
          : platform === "Codeforces"
            ? `https://codeforces.com/contest/${contest.id}`
            : "";
      return formatContest(
        contest,
        platform,
        startTime,
        endTime,
        parseInt(contest.contest_duration || contest.durationSeconds),
        contestUrl,
      );
    });
  } catch (error) {
    console.error(`Error fetching contests from ${platform}:`, error);
    return [];
  }
};

const fetchCodeChefContests = () =>
  fetchContests(
    "https://competeapi.vercel.app/contests/codechef/",
    "CodeChef",
    "future_contests",
    100,
  );
const fetchCodeChefPastContests = () =>
  fetchContests(
    "https://competeapi.vercel.app/contests/codechef/",
    "CodeChef",
    "past_contests",
    100,
  );
const fetchCodeforcesContests = () =>
  fetchContests(
    "https://codeforces.com/api/contest.list",
    "Codeforces",
    "future_contests",
    100,
  );
const fetchCodeforcesPastContests = () =>
  fetchContests(
    "https://codeforces.com/api/contest.list",
    "Codeforces",
    "past_contests",
    100,
  );

const fetchLeetContests = async () => {
  try {
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `query getUpcomingContests { upcomingContests { title startTime duration titleSlug } }`,
        operationName: "getUpcomingContests",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com/contest/",
        },
      },
    );

    return res.data.data.upcomingContests.slice(0, 100).map((contest) => {
      const startTime = new Date(contest.startTime * 1000);
      const endTime = new Date(startTime.getTime() + contest.duration * 1000);
      return formatContest(
        contest,
        "LeetCode",
        startTime,
        endTime,
        contest.duration / 60,
        `https://leetcode.com/contest/${contest.titleSlug}`,
      );
    });
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error);
    return [];
  }
};

// Function to fetch and store contests
const fetchAndStoreContests = async () => {
  try {
    const codeforcesContests = await fetchCodeforcesContests();
    const codeChefContests = await fetchCodeChefContests();
    const leetcodeContests = await fetchLeetContests();
    const codeForcePast = await fetchCodeforcesPastContests();
    const codeChefPast = await fetchCodeChefPastContests();

    const allContests = [
      ...codeforcesContests.map((c) => ({ ...c, platform: "Codeforces" })),
      ...codeChefContests.map((c) => ({ ...c, platform: "CodeChef" })),
      ...leetcodeContests.map((c) => ({ ...c, platform: "LeetCode" })),
      ...codeForcePast.map((c) => ({ ...c, platform: "Codeforces" })),
      ...codeChefPast.map((c) => ({ ...c, platform: "CodeChef" })),
    ];

    // Upsert each contest (insert if new, update if existing)
    for (const contest of allContests) {
      await prisma.contest.upsert({
        where: { url: contest.url }, // Unique identifier
        update: {
          name: contest.name,
          date: new Date(contest.date),
          time: contest.time,
          duration: contest.duration,
          status: contest.status,
        },
        create: {
          name: contest.name,
          platform: contest.platform,
          date: new Date(contest.date),
          time: contest.time,
          duration: contest.duration,
          status: contest.status,
          url: contest.url,
        },
      });
    }

    // Fetch all contests from the database
    const allData = await prisma.contest.findMany({
      orderBy: {
        status: "desc",
      },
    });

    return allData;
  } catch (error) {
    console.error("Error storing contests:", error);
    return [];
  }
};

// Call the function to fetch and store contests
fetchAndStoreContests()
  .then((data) => console.log("Contests stored successfully:", data))
  .catch((err) => console.error("Error:", err));
