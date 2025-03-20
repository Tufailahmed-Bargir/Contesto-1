import axios from "axios";
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

export const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    const now = new Date();

    return response.data.result
      .filter((contest) => contest.phase === "BEFORE") // Only upcoming contests
      .map((contest) => {
        const startTime = new Date(contest.startTimeSeconds * 1000);
        const durationSeconds = contest.durationSeconds;
        const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

        // Determine Contest Status
        let status;
        if (now < startTime) {
          status = "Upcoming";
        } else if (now >= startTime && now <= endTime) {
          status = "Ongoing";
        } else {
          status = "Finished";
        }
        // console.log("codeforces contests fetched");
        // Convert duration from seconds to hours & minutes
        const durationHours = Math.floor(durationSeconds / 3600);
        const remainingMinutes = Math.floor((durationSeconds % 3600) / 60);
        const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;

        // Format date & time
        const dateOptions = { year: "numeric", month: "long", day: "numeric" };
        const timeOptions = {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };

        return {
          name: contest.name,
          platform: "Codeforces",
          date: startTime.toLocaleDateString("en-US", dateOptions), // e.g., "April 5, 2025"
          time: startTime.toLocaleTimeString("en-US", timeOptions), // e.g., "2:35 PM"
          duration: formattedDuration,
          status,
          relativeTime: getRelativeTime(startTime, now), // e.g., "Starts in 10 hours"
          url: `https://codeforces.com/contest/${contest.id}`,
        };
      });
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
};

export const fetchCodeforcesPastContests = async () => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    const now = new Date();

    return response.data.result
      .filter((contest) => contest.phase === "FINISHED")
      .slice(0, 150)
      .map((contest) => {
        const startTime = new Date(contest.startTimeSeconds * 1000);
        const durationSeconds = contest.durationSeconds;
        const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

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
        const timeOptions = {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };

        return {
          name: contest.name,
          platform: "Codeforces",
          date: startTime.toLocaleDateString("en-US", dateOptions), // e.g., "April 5, 2025"
          time: startTime.toLocaleTimeString("en-US", timeOptions), // e.g., "2:35 PM"
          duration: formattedDuration,
          status,
          relativeTime: getRelativeTime(startTime, now), // e.g., "Starts in 10 hours"
          url: `https://codeforces.com/contest/${contest.id}`,
        };
      });
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
};
