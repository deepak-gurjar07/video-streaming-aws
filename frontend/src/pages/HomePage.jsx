import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import VideoCard from "../components/VideoCard";
import './HomePage.css'; // Import custom CSS file

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/video/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage">
      {/* <h1>Video Library</h1> */}
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;