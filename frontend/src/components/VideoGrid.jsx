import React from "react";
import VideoCard from "./VideoCard";

export default function VideoGrid({ videos }) {
  if (!videos) return null;

  return (
    <div
      className="grid grid-cols-1 gap-4  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:pl-20"
    >
      {videos.map((v) => (
        <VideoCard key={v._id} video={v} />
      ))}
    </div>
  );
}
