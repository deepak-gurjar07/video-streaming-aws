import React from 'react';
import { Link } from 'react-router-dom';
import './css/VideoCard.css'; // Import custom CSS file

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <Link to={`/video/view/${video.videoId}`}>
        <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
      </Link>
      <div className="video-info">
        <div className="video-title">{video.title}</div>
        <div className="video-author">by {video.author}</div>
        <div className="video-quality">{video.quality}</div>
      </div>
    </div>
  );
};

export default VideoCard;