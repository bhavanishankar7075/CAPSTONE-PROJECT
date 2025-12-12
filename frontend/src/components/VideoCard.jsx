/* frontend/src/components/VideoCard.jsx */
import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <Link to={`/video/${video._id}`}>
        <img src={video.thumbnailUrl || "https://picsum.photos/400/225"} alt={video.title} className="w-full h-40 object-cover" />
      </Link>
      <div className="p-3">
        <div className="font-semibold text-sm line-clamp-2">{video.title}</div>
        <div className="text-xs text-gray-600 mt-1">{video.uploader?.username || video.channel?.channelName} • {video.views} views</div>
      </div>
    </div>
  );
}
