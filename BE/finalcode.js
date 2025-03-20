import express from "express";
import axios from "axios";
import {
  fetchCodeforcesContests,
  fetchCodeforcesPastContests,
} from "./lib/codeForces.js";
import {
  fetchCodeChefContest,
  fetchCodeChefPastContests,
} from "./lib/codeChef.js";
import { fetchLeetContests, fetchLeetContestsPast } from "./lib/leetCode.js";
import Fuse from "fuse.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

import { PrismaClient } from "@prisma/client";
import {
  GetCodeChefVideos,
  GetCodeForcesVideos,
  GetLeetCodeVideos,
} from "./lib/getSolutions.js";
const prisma = new PrismaClient();

app.get("/api/all", async function (req, res) {
  try {
    const codeforcesContests = await fetchCodeforcesContests();
    const codeChefContests = await fetchCodeChefContest();
    const leetcodeContests = await fetchLeetContests();
    const codeForcePast = await fetchCodeforcesPastContests();
    const codeChefPast = await fetchCodeChefPastContests();
    const codeLeetPast = await fetchLeetContestsPast();

    const allContests = [
      ...codeforcesContests.map((c) => ({ ...c, platform: "Codeforces" })),
      ...codeChefContests.map((c) => ({ ...c, platform: "CodeChef" })),
      ...leetcodeContests.map((c) => ({ ...c, platform: "LeetCode" })),
      ...codeForcePast.map((c) => ({ ...c, platform: "Codeforces" })),
      ...codeChefPast.map((c) => ({ ...c, platform: "CodeChef" })),
      ...codeLeetPast.map((c) => ({ ...c, platform: "LeetCode" })),
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

    // const allData = await prisma.contest.findMany({})
    const allData = await prisma.contest.findMany({
      orderBy: {
        status: "desc",
      },
    });

    res.json({ contests: allData });
  } catch (error) {
    console.error("Error storing contests:", error);
    res.status(500).json({ error: "Failed to fetch and store contests" });
  }
});

app.get("/api/past", async function (req, res) {
  const codeForcePast = await fetchCodeforcesPastContests();
  const codeChefPast = await fetchCodeChefPastContests();
  const codeLeetPast = await fetchLeetContestsPast();
  res.json([
    {
      codeForcePast: codeForcePast,
      codeChefPast: codeChefPast,
      leetcodePast: codeLeetPast,
    },
  ]);
});

// get all bookmarked contetsts
app.get("/api/bookmarks", async function (req, res) {
  const bookmarked = await prisma.bookmark.findMany({});

  res.json({
    msg: "here is the list of all the past contetst!",
    bookmarked,
  });
});

// bookmark a  contetsts
app.post("/api/bookmark/:id", async function (req, res) {
  const { id: contestId } = req.params; // Correctly extract `id` from params

  try {
    const bookmark = await prisma.bookmark.create({
      data: { contestId },
    });

    res.json({
      msg: "Contest bookmarked successfully!",
      bookmark,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error bookmarking contest", error });
  }
});

// Delete a bookmark
app.delete("/api/bookmark/:id", async function (req, res) {
  const id = parseInt(req.params.id, 10); // Extract `id` from params

  try {
    await prisma.bookmark.delete({
      where: { id }, // `id` should be the primary key of the bookmark
    });

    res.json({
      msg: "Bookmark deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting bookmark", error });
  }
});

app.post("/api/filter", async function (req, res) {
  const { platforms, status } = req.body; // Expecting `platforms` as an array

  let filterConditions = {};

  // Filter contests by multiple platforms
  if (platforms && platforms.length > 0) {
    filterConditions.platform = { in: platforms }; // Matches any platform in the array
  }

  if (status) {
    filterConditions.status = status;
  }

  try {
    const contests = await prisma.contest.findMany({
      where: filterConditions,
      orderBy: { date: "desc" }, // Optional: Sort by date
    });

    res.json({
      msg: "Here are the filtered contests!",
      contests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching contests" });
  }
});

app.put("/api/contest/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const updatedLink = req.body.link;
    console.log("id recived is ", id);

    const getContest = await prisma.contest.update({
      where: {
        id,
      },
      data: {
        solution: updatedLink,
      },
    });

    res.json({
      msg: "id updated success!",
      getContest,
    });
  } catch (error) {
    console.error("Error updating contest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// admin route to add the youtube solution
app.post("/api/admin", function (req, res) {
  res.json({
    msg: "here is the list of all the past contetst!",
  });
});

app.get("/api/youtube/videos", async (req, res) => {
  try {
    const playlistId = "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr"; // Your playlist ID
    const apiKey = process.env.YOUTUBE_API_KEY; // API Key from .env file

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=100&fields=items(snippet(title,resourceId/videoId))&key=${apiKey}`;

    const response = await axios.get(url);
    const videos = response.data.items.map((video) => ({
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
    }));

    // Store in database (avoid duplicates)
    for (const video of videos) {
      await prisma.youtube_Data.upsert({
        where: { url: video.url },
        update: {}, // No update needed
        create: { title: video.title, url: video.url },
      });
    }

    const allData = await prisma.youtube_Data.findMany();
    res.json({ message: "Videos saved successfully!", allData });
  } catch (error) {
    console.error("Error fetching YouTube data:", error.message);
    res.status(500).json({ error: "Failed to fetch and store data" });
  }
});

app.get("/api/youtube/videos", async (req, res) => {
  try {
    const leetCodeSolutionVideos = await GetLeetCodeVideos();
    const CodeChefSolutionVideos = await GetCodeChefVideos();
    const CodeforcesSolutionVideos = await GetCodeForcesVideos();

    const allSolutionVideos = [
      ...codeforcesContests.map((c) => ({ ...c, platform: "Codeforces" })),
      ...codeChefContests.map((c) => ({ ...c, platform: "CodeChef" })),
      ...leetcodeContests.map((c) => ({ ...c, platform: "LeetCode" })),
      ...codeForcePast.map((c) => ({ ...c, platform: "Codeforces" })),
      ...codeChefPast.map((c) => ({ ...c, platform: "CodeChef" })),
      ...codeLeetPast.map((c) => ({ ...c, platform: "LeetCode" })),
    ];

    const storedVideos = await prisma.youtube_Data.findMany();
    res.json({ message: "Videos saved successfully!", storedVideos });
  } catch (error) {
    console.error("Error fetching YouTube data:", error.message);
    res.status(500).json({ error: "Failed to fetch and store data" });
  }
});

app.post("/api/automatch", async function (req, res) {
  try {
    // Fetch finished contests and YouTube videos
    const past_contests = await prisma.contest.findMany({
      where: { status: "Finished" },
      select: { id: true, name: true, solution: true }, // Include ID to update the solution
    });

    const savedVideos = await prisma.youtube_Data.findMany({
      select: { title: true, url: true }, // Include URL for updating contests
    });

    // Initialize Fuse.js for fuzzy matching
    const fuse = new Fuse(savedVideos, { keys: ["title"], threshold: 0.3 });

    const updates = [];

    for (const contest of past_contests) {
      const match = fuse.search(contest.name)[0]; // Get best match
      if (match) {
        updates.push({
          id: contest.id,
          solution: match.item.url, // Update solution with the matched YouTube URL
        });
      }
    }

    // Perform bulk update using Prisma
    for (const update of updates) {
      await prisma.contest.update({
        where: { id: update.id },
        data: { solution: update.solution },
      });
    }

    console.log("Updated contests with matched YouTube videos:", updates);

    res.status(200).json({
      message: "Links fethced and updated successfully!",
      updatedContests: updates,
    });
  } catch (error) {
    console.error("Error updating contest solutions:", error);

    // ❌ Always return an error response
    res.status(500).json({
      message: "Failed to update contests",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("server started on", PORT);
});
