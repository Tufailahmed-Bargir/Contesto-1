import axios from "axios";

export const fetchCodeChefContest = async () => {
  try {
    const response = await axios.get(
      "https://competeapi.vercel.app/contests/codechef/",
    );
    const now = new Date();
    // console.log("codechef contests fetched");
    return response.data.future_contests.map((contest) => {
      const startTime = new Date(contest.contest_start_date_iso);
      const endTime = new Date(contest.contest_end_date_iso);

      // Determine Contest Status
      let status;
      if (now < startTime) {
        status = "Upcoming";
      } else if (now >= startTime && now <= endTime) {
        status = "Ongoing";
      } else {
        status = "Finished";
      }

      // Convert duration from minutes to hours & minutes
      const durationMinutes = parseInt(contest.contest_duration);
      const durationHours = Math.floor(durationMinutes / 60);
      const remainingMinutes = durationMinutes % 60;
      const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;

      // Convert date & time to readable format
      const dateOptions = { year: "numeric", month: "long", day: "numeric" };
      const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };

      return {
        name: contest.contest_name,
        platform: "CodeChef",
        date: startTime.toLocaleDateString("en-US", dateOptions), // e.g., "March 19, 2025"
        time: startTime.toLocaleTimeString("en-US", timeOptions), // e.g., "8:00 PM"
        duration: formattedDuration,
        status,
        relativeTime: getRelativeTime(startTime, now), // e.g., "Starts in 5 hours"
        url: `https://www.codechef.com/${contest.contest_code}`,
      };
    });
  } catch (error) {
    console.error("Error fetching contests from CodeChef API:", error);
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

// to get all the past contests of codechef
export const fetchCodeChefPastContests = async () => {
  try {
    const response = await axios.get(
      "https://competeapi.vercel.app/contests/codechef/",
    );
    const now = new Date();

    return response.data.past_contests.slice(0, 200).map((contest) => {
      const startTime = new Date(contest.contest_start_date_iso);
      const endTime = new Date(contest.contest_end_date_iso);

      // Determine Contest Status
      let status;
      if (now < startTime) {
        status = "Upcoming";
      } else if (now >= startTime && now <= endTime) {
        status = "Ongoing";
      } else {
        status = "Finished";
      }

      // Convert duration from minutes to hours & minutes
      const durationMinutes = parseInt(contest.contest_duration);
      const durationHours = Math.floor(durationMinutes / 60);
      const remainingMinutes = durationMinutes % 60;
      const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;

      // Convert date & time to readable format
      const dateOptions = { year: "numeric", month: "long", day: "numeric" };
      const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };

      return {
        name: contest.contest_name,
        platform: "CodeChef",
        date: startTime.toLocaleDateString("en-US", dateOptions), // e.g., "March 19, 2025"
        time: startTime.toLocaleTimeString("en-US", timeOptions), // e.g., "8:00 PM"
        duration: formattedDuration,
        status,
        relativeTime: getRelativeTime(startTime, now), // e.g., "Starts in 5 hours"
        url: `https://www.codechef.com/${contest.contest_code}`,
      };
    });
  } catch (error) {
    console.error("Error fetching contests from CodeChef API:", error);
    return [];
  }
};
