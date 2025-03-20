import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "AIzaSyBJWp0FyOk2F0X6bPbbno3nd0-oJl_wDI8"; // Replace with your actual API key

const useFetchYouTubeVideos = (playlistId) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems`,
          {
            params: {
              part: "snippet",
              playlistId: playlistId,
              maxResults: 100,
              fields: "items(snippet(title,resourceId/videoId))",
              key: API_KEY,
            },
          },
        );

        // Extract relevant data
        const fetchedVideos = response.data.items.map((item) => ({
          title: item.snippet.title,
          videoId: item.snippet.resourceId.videoId, // Get video ID
        }));

        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [playlistId]);

  return { videos, loading };
};

export default useFetchYouTubeVideos;
