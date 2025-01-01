import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link className="group block no-underline" to={`/video/view/${video.videoId}`}>
      <div className="relative">
        <img className="rounded-lg aspect-video w-full object-cover" src={video.thumbnailUrl} alt={video.title} />
      </div>

      <div className="flex gap-3 py-3 px-2">
        <div>
          <h2 className="group-hover:text-blue-500 font-semibold leading-snug line-clamp-2 text-base" title={video.title}>
            {video.title}
          </h2>
          <p className="text-sm mt-1 text-neutral-700 hover:text-neutral-500">
            {video.auther}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;