import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';
import VideoCard from './VideoCard';
import './css/VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/video/${videoId}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllVideos = async () => {
      try {
        const response = await axios.get('/video/videos');
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideo();
    fetchAllVideos();

    // Clear timer on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [videoId]);

  useEffect(() => {
    // Reset player state when video changes
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [videoId]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-red-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error</h3>
          </div>
          <p className="mt-2 text-red-700 dark:text-red-300">Video not found. The video may have been removed or is unavailable.</p>
        </div>
      </div>
    );
  }

  const remainingVideos = videos.filter(v => v.videoId !== videoId);

  return (
    <div className="video-player-page">
      <div className="video-section">
        <div 
          ref={playerContainerRef}
          className="video-player-container" 
          onMouseMove={handleMouseMove}
        >
          <div className="video-wrapper">
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="main-video"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onClick={handlePlayPause}
            />
            
            {/* Custom Video Controls */}
            <div className={`video-controls ${showControls ? 'visible' : 'hidden'}`}>
              {/* Play/Pause Button */}
              <button className="control-btn play-pause" onClick={handlePlayPause}>
                {isPlaying ? (
                  <svg className="control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                ) : (
                  <svg className="control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
              </button>
              
              {/* Progress Bar */}
              <div className="progress-container">
                <span className="time-display">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="progress-bar"
                />
                <span className="time-display">{formatTime(duration)}</span>
              </div>
              
              {/* Volume Control */}
              <div className="volume-container">
                <button className="control-btn volume-btn">
                  {volume === 0 ? (
                    <svg className="control-icon small" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg className="control-icon small" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072"></path>
                    </svg>
                  ) : (
                    <svg className="control-icon small" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.07 8.93a10 10 0 010 6.14"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.07 5.93a16 16 0 010 12.14"></path>
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
              
              {/* Fullscreen Button */}
              <button className="control-btn fullscreen-btn" onClick={handleFullScreen}>
                {isFullScreen ? (
                  <svg className="control-icon small" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25"></path>
                  </svg>
                ) : (
                  <svg className="control-icon small" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="video-info">
          <h1 className="video-title">{video.title}</h1>
          <div className="video-meta">
            <div className="author-info">
              <div className="author-avatar">
                {video.author.charAt(0).toUpperCase()}
              </div>
              <div className="author-name">{video.author}</div>
            </div>
            <div className="video-stats">
              <div className="quality-badge">{video.quality}</div>
              <div className="upload-date">{new Date(video.uploadDate).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="video-description">
            <h3>Description</h3>
            <p>{video.description}</p>
          </div>
        </div>
      </div>
      
      <div className="related-videos">
        <h2>Recommended Videos</h2>
        <div className="related-videos-grid">
          {remainingVideos.length === 0 ? (
            <p className="no-videos">No related videos found</p>
          ) : (
            remainingVideos.slice(0, 4).map((vid) => (
              <div key={vid.videoId} className="related-video-card">
                <VideoCard video={vid} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;