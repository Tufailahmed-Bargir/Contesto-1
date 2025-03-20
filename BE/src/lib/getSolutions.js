//

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function GetLeetCodeVideos() {
  try {
    const apiKey = "AIzaSyBJWp0FyOk2F0X6bPbbno3nd0-oJl_wDI8";
    const playlistId = "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr";

    let allVideos = [];
    let nextPageToken = "";

    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&fields=nextPageToken,items(snippet(title,resourceId/videoId))&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;

      const response = await axios.get(url);

      if (response.data.items) {
        allVideos.push(...response.data.items);
      }

      nextPageToken = response.data.nextPageToken; // Get next page token
    } while (nextPageToken); // Loop until there are no more pages

    return allVideos;
  } catch (error) {
    console.error("Error fetching LeetCode videos:", error);
    return null;
  }
}

// Call the function (for testing)
GetLeetCodeVideos().then((videos) =>
  console.log("Total Videos Fetched:", JSON.stringify(videos)),
);

export async function GetCodeForcesVideos() {
  try {
    const apiKey = "AIzaSyBJWp0FyOk2F0X6bPbbno3nd0-oJl_wDI8";
    const playlistId = "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB";

    let allVideos = [];
    let nextPageToken = "";

    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&fields=nextPageToken,items(snippet(title,resourceId/videoId))&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;

      const response = await axios.get(url);

      if (response.data.items) {
        allVideos.push(...response.data.items);
      }

      nextPageToken = response.data.nextPageToken; // Get next page token
    } while (nextPageToken); // Loop until there are no more pages

    return allVideos;
  } catch (error) {
    console.error("Error fetching LeetCode videos:", error);
    return null;
  }
}

// Call the function (for testing)
GetCodeForcesVideos().then((videos) =>
  console.log("Total Videos Fetched:", videos?.length),
);

export async function GetCodeChefVideos() {
  try {
    const apiKey = "AIzaSyBJWp0FyOk2F0X6bPbbno3nd0-oJl_wDI8";
    const playlistId = "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr";

    let allVideos = [];
    let nextPageToken = "";

    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&fields=nextPageToken,items(snippet(title,resourceId/videoId))&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;

      const response = await axios.get(url);

      if (response.data.items) {
        allVideos.push(...response.data.items);
      }

      nextPageToken = response.data.nextPageToken; // Get next page token
    } while (nextPageToken); // Loop until there are no more pages

    return allVideos;
  } catch (error) {
    console.error("Error fetching LeetCode videos:", error);
    return null;
  }
}

// Call the function (for testing)
GetCodeChefVideos().then((videos) =>
  console.log("Total Videos Fetched:", videos.length),
);
