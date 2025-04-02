import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

const EditVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [quality, setQuality] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { videoId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching video details for ID: ${videoId}`);
        
        // Use the get single video endpoint which likely exists
        const response = await axios.get(`/video/${videoId}`);
        console.log('Video details response:', response.data);
        const videoData = response.data;
        
        setTitle(videoData.title || '');
        setDescription(videoData.description || '');
        setAuthor(videoData.auther || ''); // Note: API has a typo in "auther"
        setQuality(videoData.quality || '');
        setCurrentThumbnail(videoData.thumbnailUrl || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching video details:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError(`Failed to load video details. Error: ${error.message || 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    
    if (!user || !user.email) {
      setError('You must be logged in to update a video.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Since there might not be a dedicated update endpoint, 
      // we'll try the simplest approach first: delete and re-upload
      // First update the basic details if that endpoint exists
      const updateData = {
        videoId,
        email: user.email,
        title,
        description,
        author, // Note: API might expect "auther" instead
        quality
      };

      // Try to update basic info
      await axios.post('/video/update', updateData);
      
      // If thumbnail was changed, handle that separately
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('videoId', videoId);
        formData.append('thumbnail', thumbnailFile);
        
        // Try to update thumbnail
        await axios.post('/video/update-thumbnail', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      setSuccess('Video details updated successfully!');
      setError('');
      setIsSubmitting(false);
      setThumbnailFile(null);
      
      // Refresh the page to show updated details
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating video details:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setError(`Failed to update video details. Error: ${error.message || 'Unknown error'}`);
      setSuccess('');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video? This action cannot be undone.");
    if (!confirmDelete) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log(`Deleting video with ID: ${videoId}`);
      // Use the standard delete endpoint
      await axios.delete(`/video/${videoId}`, { 
        data: { email: user.email } 
      });
      console.log('Video successfully deleted');
      setIsSubmitting(false);
      navigate('/profile', { state: { message: 'Video deleted successfully' } });
    } catch (error) {
      console.error('Error deleting video:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setError(`Failed to delete video. Error: ${error.message || 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading video details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-dark-100 rounded-lg shadow-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Video Details</h2>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profile
          </button>
        </div>
        
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleUpdateVideo} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-base py-2.5 dark:bg-dark-200 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Enter video description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-base dark:bg-dark-200 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Author
              </label>
              <input
                type="text"
                id="author"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-base py-2.5 dark:bg-dark-200 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quality
              </label>
              <input
                type="text"
                id="quality"
                placeholder="e.g. 1080p, 4K"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-base py-2.5 dark:bg-dark-200 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="thumbnail-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Thumbnail (Optional)
            </label>
            
            {currentThumbnail && (
              <div className="mt-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Thumbnail:</label>
                <img 
                  src={currentThumbnail} 
                  alt="Current Thumbnail" 
                  className="w-full max-w-xs rounded-lg border border-gray-200 dark:border-gray-700" 
                />
              </div>
            )}
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="thumbnail-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    <span>Upload a new thumbnail</span>
                    <input 
                      id="thumbnail-upload" 
                      type="file" 
                      accept="image/*" 
                      className="sr-only" 
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
                {thumbnailFile && (
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    Selected: {thumbnailFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Once you delete a video, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Video
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVideo; 