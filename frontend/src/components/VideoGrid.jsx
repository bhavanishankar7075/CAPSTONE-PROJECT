/* frontend/src/components/VideoGrid.jsx */
import React from "react";
import VideoCard from "./VideoCard";
import "../styles/VideoGrid.css";

export default function VideoGrid({ videos }) {
  if (!videos) return null;
  return (
    <div className="video-grid grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map(v => <VideoCard key={v._id} video={v} />)}
    </div>
  );
}
