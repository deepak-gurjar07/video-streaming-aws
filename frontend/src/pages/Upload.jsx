import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import './css/Upload.css'; 

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [quality, setQuality] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email) {
      setEmail(storedUser.email);
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author);
    formData.append('quality', quality);
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);
    formData.append('email', email); 

    try {
      const response = await axios.post('/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      console.log('Upload response:', response);
      setSuccess('Video and thumbnail uploaded successfully!');
      setError('');
      setUploadProgress(0);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading video and thumbnail:', error);
      setError('Failed to upload video and thumbnail. Please try again.');
      setSuccess('');
      setUploadProgress(0); 
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quality">Quality</label>
          <input
            type="text"
            id="quality"
            placeholder="Quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="video-upload">Upload Video</label>
          <input
            type="file"
            id="video-upload"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="thumbnail-upload">Upload Thumbnail</label>
          <input
            type="file"
            id="thumbnail-upload"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            required
          />
        </div>
        {isUploading && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${uploadProgress}%` }}>
              {uploadProgress}%
            </div>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Please wait, your video is being uploaded...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default Upload;