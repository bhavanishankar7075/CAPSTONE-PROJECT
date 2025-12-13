import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <div className="overflow-hidden bg-white shadow-sm rounded-xl">
      <Link to={`/video/${video._id}`}>
        <img
          src={video.thumbnailUrl || "https://picsum.photos/400/225"}
          alt={video.title}
          className="object-cover w-full aspect-video"
        />
      </Link>
      <div className="p-3">
        <p className="text-sm font-semibold line-clamp-2">
          {video.title}
        </p>
        <p className="mt-1 text-xs text-gray-600">
          {video.uploader?.username || video.channel?.channelName} •{" "}
          {video.views} views
        </p>
      </div>
    </div>
  );
}
