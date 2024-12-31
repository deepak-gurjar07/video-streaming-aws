import React from "react";
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './VideoCard.css'; // Import custom CSS file

const VideoCard = ({ video }) => {
  return (
    <Card style={{ width: '18rem' }} className="video-card">
      <Link to={`/video/view/${video.videoId}`}>
        <Card.Img variant="top" src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
      </Link>
      <Card.Body>
        <Card.Title className="video-title">{video.title}</Card.Title>
        <Card.Text className="video-author">Author: {video.author}</Card.Text>
        <Card.Text className="video-quality">Quality: {video.quality}</Card.Text>
        <Link to={`/video/view/${video.videoId}`}>
          <Button variant="primary">Watch Video</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default VideoCard;