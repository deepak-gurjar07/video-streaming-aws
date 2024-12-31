import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import VideoCard from '../components/VideoCard';
import './css/Profile.css'; 

const Profile = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`/video/author/${user.email}`);
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user.email]);

  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`/video/${videoId}`, { data: { email: user.email } });
      setVideos(videos.filter(video => video.videoId !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-left">
        <div className="video-grid">
          {videos.length === 0 ? (
            <p>No videos found.</p>
          ) : (
            videos.map(video => (
              <div key={video.videoId} className="video-card-container">
                <VideoCard video={video} />
                <button onClick={() => handleDelete(video.videoId)} className="delete-button">Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="profile-right">
        <h2>User Details</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
      </div>
    </div>
  );
};

export default Profile;