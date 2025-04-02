import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link 
      to={`/video/view/${video.videoId}`}
      className="group block bg-white dark:bg-dark-100 rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 no-underline"
      style={{ textDecoration: 'none' }}
    >
      <div className="relative">
        <div className="aspect-video w-full bg-gray-200 dark:bg-dark-200 overflow-hidden">
          <img 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            src={video.thumbnailUrl} 
            alt={video.title} 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration || '00:00'}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h2 
          className="text-gray-900 dark:text-white font-medium text-lg leading-tight line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors no-underline"
          title={video.title}
          style={{ textDecoration: 'none' }}
        >
          {video.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <span>{video.auther}</span>
          {video.views && (
            <span className="flex items-center ml-2">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {video.views} views
            </span>
          )}
        </p>
      </div>
    </Link>
  );
};

export default VideoCard;