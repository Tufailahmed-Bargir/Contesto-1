import axios from "axios";

export const fetchLeetContests = async () => {
  try {
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `query getUpcomingContests { 
          upcomingContests { 
            title
            startTime
            duration
            titleSlug 
          } 
        }`,
        operationName: "getUpcomingContests",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com/contest/",
        },
      },
    );

    const now = new Date();

    const formattedContests = res.data.data.upcomingContests.map((contest) => {
      const startTime = new Date(contest.startTime * 1000);
      const durationSeconds = contest.duration;
      const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

      // Determine contest status
      let status;
      if (now < startTime) {
        status = "Upcoming";
      } else if (now >= startTime && now <= endTime) {
        status = "Ongoing";
      } else {
        status = "Finished";
      }

      // Convert duration from seconds to hours & minutes
      const durationHours = Math.floor(durationSeconds / 3600);
      const remainingMinutes = Math.floor((durationSeconds % 3600) / 60);
      const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;

      // Format date & time
      const dateOptions = { year: "numeric", month: "long", day: "numeric" };
      const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };

      return {
        name: contest.title,
        platform: "LeetCode",
        date: startTime.toLocaleDateString("en-US", dateOptions), // e.g., "April 5, 2025"
        time: startTime.toLocaleTimeString("en-US", timeOptions), // e.g., "8:05 PM"
        duration: formattedDuration,
        status,
        relativeTime: getRelativeTime(startTime, now), // e.g., "Starts in 10 hours"
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      };
    });

    return formattedContests;
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error);
    return [];
  }
};

// Function to calculate relative time (e.g., "Starts in 5 hours")
const getRelativeTime = (startTime, now) => {
  const diff = startTime - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (diff > 0) {
    return `Starts in ${hours} hr ${minutes} min`;
  } else {
    return "Started";
  }
};

export const fetchLeetContestsPast = async () => {
  try {
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `query getPastContests { 
          upcomingContests { 
            title
            startTime
            duration
            titleSlug 
          } 
        }`,
        operationName: "getUpcomingContests",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com/contest/",
        },
      },
    );

    const now = new Date();

    const formattedContests = res.data.data.upcomingContests.map((contest) => {
      const startTime = new Date(contest.startTime * 1000);
      const durationSeconds = contest.duration;
      const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

      // Determine contest status
      let status;
      if (now < startTime) {
        status = "Upcoming";
      } else if (now >= startTime && now <= endTime) {
        status = "Ongoing";
      } else {
        status = "Finished";
      }

      // Convert duration from seconds to hours & minutes
      const durationHours = Math.floor(durationSeconds / 3600);
      const remainingMinutes = Math.floor((durationSeconds % 3600) / 60);
      const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;

      // Format date & time
      const dateOptions = { year: "numeric", month: "long", day: "numeric" };
      const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };

      return {
        name: contest.title,
        platform: "LeetCode",
        date: startTime.toLocaleDateString("en-US", dateOptions), // e.g., "April 5, 2025"
        time: startTime.toLocaleTimeString("en-US", timeOptions), // e.g., "8:05 PM"
        duration: formattedDuration,
        status,
        relativeTime: getRelativeTime(startTime, now), // e.g., "Starts in 10 hours"
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      };
    });

    return formattedContests;
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error);
    return [];
  }
};
