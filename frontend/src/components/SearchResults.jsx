import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axiosConfig";
import VideoCard from "../components/VideoCard";
import "./SearchResults.css";

const SearchResults = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`/video/search?query=${query}`);
        setVideos(response.data);
      } catch (error) {
        console.error("Error searching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  return (
    <div className="search-results-container">
      <h1 className="search-results-title">Search Results</h1>
      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="video-cards-container">
          {videos.map((video) => (
            <div key={video.videoId} className="video-card-wrapper">
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;