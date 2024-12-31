import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './css/VideoPlayer.css'; 

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/video/view/${videoId}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="video-player-container">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-player-container">
        <p>Video not found</p>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <Card className="video-player-card">
        <Card.Body>
          <div className="video-wrapper">
            <video controls className="video-element">
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <Card.Title className="video-title">{video.title}</Card.Title>
          <Row className="video-details">
            <Col className="video-author" xs={6}>Author: {video.author}</Col>
            <Col className="video-quality" xs={6} style={{ textAlign: 'right' }}>Quality: {video.quality}</Col>
          </Row>
          <Card.Text className="video-description">{video.description}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VideoPlayer;