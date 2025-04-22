import express from "express";
import axios from "axios";
import jwt from 'jsonwebtoken'
const jwt_secrect='contesto'
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
import bcrypt from 'bcrypt'
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

import { prisma } from "./lib/prisma.js";

// JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ msg: 'No token provided' });
  
  jwt.verify(token, jwt_secrect, (err, user) => {
    if (err) return res.status(403).json({ msg: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Token verification endpoint
app.get('/api/verify', authenticateToken, (req, res) => {
  res.status(200).json({ 
    msg: 'Token is valid',
    user: {
      id: req.user.id,
      isAdmin: req.user.isAdmin || false
    }
  });
});

// Apply authentication middleware to protected routes
const protectRoute = (req, res, next) => {
  authenticateToken(req, res, next);
};

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
    // console.log("id recived is ", id);

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
    const playlistIds = [
      process.env.LEET_CODE_ID,
      process.env.CODE_FORCES_ID,
      process.env.CODE_CHEF_ID,
    ];
    const apiKey = process.env.YOUTUBE_API_KEY;
    let allVideos = [];

    for (const playlistId of playlistIds) {
      let nextPageToken = null;

      do {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&fields=items(snippet(title,resourceId/videoId)),nextPageToken&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;

        const response = await axios.get(url);
        const videos = response.data.items.map((video) => ({
          title: video.snippet.title,
          url: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
        }));

        allVideos = allVideos.concat(videos);
        nextPageToken = response.data.nextPageToken || null;
      } while (nextPageToken);
    }

    // Store unique videos in the database
    for (const video of allVideos) {
      await prisma.youtube_Data.upsert({
        where: { url: video.url },
        update: {}, // No update needed
        create: { title: video.title, url: video.url },
      });
    }

    // Fetch and return all stored videos
    const storedVideos = await prisma.youtube_Data.findMany();
    res.json({ message: "Videos saved successfully!", storedVideos });
  } catch (error) {
    console.error("Error fetching YouTube data:", error.message);
    res.status(500).json({ error: "Failed to fetch and store data" });
  }
});
app.post("/api/automatch", async (c) => {
  try {
    // Fetch finished contests and YouTube videos
    const pastContests = await prisma.contest.findMany({
      where: { status: "Finished" },
      select: { id: true, name: true, solution: true }, // Include ID to update the solution
    });

    const savedVideos = await prisma.youtube_Data.findMany({
      select: { title: true, url: true }, // Include URL for updating contests
    });

    // Initialize Fuse.js for fuzzy matching
    const fuse = new Fuse(savedVideos, { keys: ["title"], threshold: 0.3 });

    // const updates: { id: number; solution: string }[] = [];

    for (const contest of pastContests) {
      const match = fuse.search(contest.name)[0]; // Get the best match
      if (match) {
        updates.push({
          id: contest.id,
          solution: match.item.url, // Update solution with the matched YouTube URL
        });
      }
    }

    // Perform bulk updates using Prisma
    for (const update of updates) {
      await prisma.contest.update({
        where: { id: update.id },
        data: { solution: update.solution },
      });
    }

    console.log("Updated contests with matched YouTube videos:", updates);

    return c.json({
      message: `Total ${updates.length} solution links fetched and updated successfully!`,
      updatedContests: updates,
    });
  } catch (error) {
    console.error("Error updating contest solutions:", error);

    return c.json(
      {
        message: "Failed to update contests",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
app.listen(PORT, () => {
  console.log("server started on", PORT);
});


// user login 
app.post('/signup', async function(req, res) {
  try {
    const { name, email, password } = req.body;
    console.log('Signup data received', req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "Please input all the fields!"
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        msg: "User with this email already exists!"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        lastLoginAt: new Date() // Set initial login time
      }
    });

    const token = jwt.sign({ id: createUser.id }, jwt_secrect, { expiresIn: '1d' });
    console.log('Token created successfully!', token);

    return res.status(201).json({
      msg: "User created successfully!",
      createUser,
      token
    });
  } catch (e) {
    console.error('Signup error:', e);
    return res.status(500).json({
      msg: "Something went wrong. Please try again later."
    });
  }
});

// User login route
app.post('/login', async function(req, res) {
  try {
    const { email, password, name } = req.body;
    console.log('Login data received', req.body);
    
    if (!email || !password) {
      return res.status(400).json({
        msg: "Please provide email and password"
      });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // If user doesn't exist, create one (auto signup)
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email,
          password: hashedPassword,
          lastLoginAt: new Date(), // Record first login time
        }
      });

      const token = jwt.sign({ 
        id: newUser.id, 
        email: newUser.email,
        isAdmin: false
      }, jwt_secrect, { expiresIn: '7d' });

      return res.status(201).json({
        msg: "User created and logged in successfully",
        token
      });
    }

    // Check password for existing user
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        msg: "Invalid credentials"
      });
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email,
      isAdmin: false
    }, jwt_secrect, { expiresIn: '7d' });

    return res.json({
      msg: "Login successful",
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      msg: "Something went wrong. Please try again later."
    });
  }
});

// Admin login route
app.post('/admin_login', async function(req, res) {
  try {
    const { admin_name, password } = req.body;
    console.log('Admin login data received', req.body);
    
    if (!admin_name || !password) {
      return res.status(400).json({
        msg: "Please provide admin name and password"
      });
    }

    // Find the admin
    let admin;
    try {
      admin = await prisma.admin.findFirst({
        where: { admin_name }
      });
    } catch (dbError) {
      console.error('Database error finding admin:', dbError);
      return res.status(500).json({
        msg: "Database error when finding admin"
      });
    }

    // If admin doesn't exist, create one
    if (!admin) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await prisma.admin.create({
          data: {
            admin_name,
            password: hashedPassword,
            lastLoginAt: new Date() // Record first login time
          }
        });
        
        console.log('New admin created successfully!');
        
        const token = jwt.sign({ 
          id: newAdmin.id, 
          admin_name: newAdmin.admin_name,
          isAdmin: true
        }, jwt_secrect, { expiresIn: '7d' });

        console.log('Admin token created successfully!', token);
        
        return res.status(201).json({
          msg: "Admin created and logged in successfully",
          token
        });
      } catch (createError) {
        console.error('Error creating new admin:', createError);
        return res.status(500).json({
          msg: "Could not create admin account. Admin name may already be taken.",
          errorType: createError.name
        });
      }
    }

    // Check password for existing admin
    try {
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        return res.status(401).json({
          msg: "Invalid credentials"
        });
      }

      // Update last login timestamp
      await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() }
      });

      // Generate JWT token
      const token = jwt.sign({ 
        id: admin.id, 
        admin_name: admin.admin_name,
        isAdmin: true
      }, jwt_secrect, { expiresIn: '7d' });

      return res.json({
        msg: "Admin login successful",
        token
      });
    } catch (authError) {
      console.error('Authentication error:', authError);
      return res.status(500).json({
        msg: "Authentication error",
        errorType: authError.name
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      msg: "Something went wrong. Please try again later.",
      errorType: error.name || 'UnknownError'
    });
  }
});