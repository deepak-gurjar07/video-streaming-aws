import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import VideoCard from "../components/VideoCard";
import './css/HomePage.css'; 

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
      <div className="video-grid">
        {videos.map((video) => (
           <div key={video.videoId} className="video-card-container">
          <VideoCard key={video.videoId} video={video} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;