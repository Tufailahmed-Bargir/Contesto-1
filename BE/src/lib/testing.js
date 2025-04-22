// // import axios from "axios";

// // async function main(){
// //  try {

// //     const res = await axios.get('https://competeapi.vercel.app/contests/codechef/')
// //     const res2 = await axios.get('https://codeforces.com/api/contest.list')
// //     const res3 = await axios.post(
// //         "https://leetcode.com/graphql",
// //         {
// //           query: `query getUpcomingContests {
// //             upcomingContests {
// //               title
// //               startTime
// //               duration
// //               titleSlug
// //             }
// //           }`,
// //           operationName: "getUpcomingContests",
// //         },
// //         {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Referer: "https://leetcode.com/contest/",
// //           },
// //         },
// //       );
// //     const data1 = res.data
// //     const data2 = res2.data.result.filter((contest)=> contest.phase ==='BEFORE')
// // console.log('all leetcode',res3.data.data.upcomingContests);

// // const data3 = res2.data.result.filter((contest)=> contest.phase ==='FINISHED').slice(0,100)

// // const data4 = res3.data.data.upcomingContests;

// //  } catch (error) {
// //     console.log('erro found');

// //  }
// // }

// // main()

// import axios from "axios";

// // Function to get relative time
// const getRelativeTime = (startTime, now) => {
//   const diff = startTime.getTime() - now.getTime();
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//   return diff > 0 ? `Starts in ${hours} hr ${minutes} min` : "Started";
// };

// // Function to format date & time
// const formatDate = (date) =>
//   date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

// const formatTime = (date) =>
//   date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

// // Function to process contest data
// const processContests = (contests, platform, now) =>
//   contests.map((contest) => {
//     const startTime = new Date(contest.startTimeSeconds * 1000);
//     const durationSeconds = contest.durationSeconds;
//     const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

//     // Determine Contest Status
//     let status = now < startTime ? "Upcoming" : now <= endTime ? "Ongoing" : "Finished";

//     // Convert duration from seconds to hours & minutes
//     const durationHours = Math.floor(durationSeconds / 3600);
//     const remainingMinutes = Math.floor((durationSeconds % 3600) / 60);
//     const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;

//     return {
//       name: contest.name,
//       platform,
//       date: formatDate(startTime),
//       time: formatTime(startTime),
//       duration: formattedDuration,
//       status,
//       relativeTime: getRelativeTime(startTime, now),
//       url: platform === "Codeforces" ? `https://codeforces.com/contest/${contest.id}` : "",
//     };
//   });

// // Fetch Codeforces Upcoming Contests
// export const fetchCodeforcesContests = async () => {
//   try {
//     const response = await axios.get("https://codeforces.com/api/contest.list");
//     const now = new Date();
//     return processContests(response.data.result.filter((c) => c.phase === "BEFORE"), "Codeforces", now);
//   } catch (error) {
//     console.error("Error fetching Codeforces contests:", error);
//     return [];
//   }
// };

// // Fetch Codeforces Past Contests
// export const fetchCodeforcesPastContests = async () => {
//   try {
//     const response = await axios.get("https://codeforces.com/api/contest.list");
//     const now = new Date();
//     return processContests(response.data.result.filter((c) => c.phase === "FINISHED").slice(0, 100), "Codeforces", now);
//   } catch (error) {
//     console.error("Error fetching past Codeforces contests:", error);
//     return [];
//   }
// };

// // Fetch CodeChef Contests
// export const fetchCodechefContests = async () => {
//   try {
//     const response = await axios.get("https://competeapi.vercel.app/contests/codechef/");
//     const now = new Date();

//     // Filter only upcoming contests (BEFORE)
//     // const data = response.data.result.filter((contest) => contest.phase === "BEFORE");

//     const data = response.data.future_contests;

//     return data.map((contest) => {
//       const startTime = new Date(contest.startTimeSeconds * 1000);
//       const durationSeconds = contest.durationSeconds;
//       const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

//       let status = now < startTime ? "Upcoming" : now <= endTime ? "Ongoing" : "Finished";

//       const durationHours = Math.floor(durationSeconds / 3600);
//       const remainingMinutes = Math.floor((durationSeconds % 3600) / 60);
//       const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;

//       return {
//         name: contest.name,
//         platform: "CodeChef",
//         date: formatDate(startTime),
//         time: formatTime(startTime),
//         duration: formattedDuration,
//         status,
//         relativeTime: getRelativeTime(startTime, now),
//         url: contest.url || "https://www.codechef.com/contests",
//       };
//     });
//   } catch (error) {
//     console.error("Error fetching CodeChef contests:", error);
//     return [];
//   }
// };

// // Fetch LeetCode Contests
// export const fetchLeetCodeContests = async () => {
//   try {
//     const response = await axios.post(
//       "https://leetcode.com/graphql",
//       {
//         query: `query getUpcomingContests {
//           upcomingContests {
//             title
//             startTime
//             duration
//             titleSlug
//           }
//         }`,
//         operationName: "getUpcomingContests",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Referer: "https://leetcode.com/contest/",
//         },
//       }
//     );

//     const now = new Date();
//     return response.data.data.upcomingContests.map((contest) => {
//       const startTime = new Date(contest.startTime * 1000);
//       const durationSeconds = contest.duration;
//       const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

//       let status = now < startTime ? "Upcoming" : now <= endTime ? "Ongoing" : "Finished";

//       const durationHours = Math.floor(durationSeconds / 3600);
//       const remainingMinutes = Math.floor((durationSeconds % 3600) / 60);
//       const formattedDuration = `${durationHours} hr ${remainingMinutes} min`;

//       return {
//         name: contest.title,
//         platform: "LeetCode",
//         date: formatDate(startTime),
//         time: formatTime(startTime),
//         duration: formattedDuration,
//         status,
//         relativeTime: getRelativeTime(startTime, now),
//         url: `https://leetcode.com/contest/${contest.titleSlug}`,
//       };
//     });
//   } catch (error) {
//     console.error("Error fetching LeetCode contests:", error);
//     return [];
//   }
// };

// // Fetch all contests in parallel
// export const fetchAllContests = async () => {
//   try {
//     const [codeforces, codeforcesPast, codechef, leetcode] = await Promise.all([
//       fetchCodeforcesContests(),
//       fetchCodeforcesPastContests(),
//       fetchCodechefContests(),
//       fetchLeetCodeContests(),
//     ]);

//     return {
//       codeforces,
//       codeforcesPast,
//       codechef,
//       leetcode,
//     };
//   } catch (error) {
//     console.error("Error fetching all contests:", error);
//     return {};
//   }
// };

// // Execute and Log Results
// fetchAllContests().then((data) => console.log("Fetched Contests:", data));

const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const prisma = new PrismaClient();

const processContests = (contests, platform) => {
  const now = new Date();
  return contests.map((contest) => {
    const startTime = new Date(contest.startTimeSeconds * 1000);
    const durationSeconds = contest.durationSeconds;
    const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
    const status =
      now < startTime ? "Upcoming" : now <= endTime ? "Ongoing" : "Finished";
    const formattedDuration = `${Math.floor(durationSeconds / 3600)} hr ${Math.floor((durationSeconds % 3600) / 60)} min`;

    return {
      name: contest.name,
      platform,
      date: startTime,
      duration: formattedDuration,
      status,
      url:
        platform === "Codeforces"
          ? `https://codeforces.com/contest/${contest.id}`
          : contest.url || "",
    };
  });
};

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    return processContests(
      response.data.result.filter((c) => c.phase === "BEFORE"),
      "Codeforces",
    );
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
};

const fetchCodechefContests = async () => {
  try {
    const response = await axios.get(
      "https://competeapi.vercel.app/contests/codechef/",
    );
    return processContests(response.data.future_contests, "CodeChef");
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    return [];
  }
};

const fetchLeetCodeContests = async () => {
  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `query getUpcomingContests { upcomingContests { title startTime duration titleSlug } }`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com/contest/",
        },
      },
    );
    return response.data.data.upcomingContests.map((contest) => ({
      name: contest.title,
      platform: "LeetCode",
      date: new Date(contest.startTime * 1000),
      duration: `${Math.floor(contest.duration / 3600)} hr ${Math.floor((contest.duration % 3600) / 60)} min`,
      status: "Upcoming",
      url: `https://leetcode.com/contest/${contest.titleSlug}`,
    }));
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error);
    return [];
  }
};

const saveContestsToDB = async () => {
  try {
    const [codeforces, codechef, leetcode] = await Promise.all([
      fetchCodeforcesContests(),
      fetchCodechefContests(),
      fetchLeetCodeContests(),
    ]);

    const allContests = [...codeforces, ...codechef, ...leetcode];

    for (const contest of allContests) {
      await prisma.contest.upsert({
        where: { url: contest.url },
        update: {
          name: contest.name,
          platform: contest.platform,
          date: contest.date,
          duration: contest.duration,
          status: contest.status,
        },
        create: {
          name: contest.name,
          platform: contest.platform,
          date: contest.date,
          duration: contest.duration,
          status: contest.status,
          solution: "https://www.youtube.com/",
          url: contest.url,
        },
      });
    }

    console.log("✅ Contests saved successfully!");
  } catch (error) {
    console.error("❌ Error inserting contests into DB:", error);
  } finally {
    await prisma.$disconnect();
  }
};

saveContestsToDB();
