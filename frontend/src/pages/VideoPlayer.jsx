import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoById, likeVideo, dislikeVideo } from "../store/VideoSlice";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
} from "../store/commentsSlice";
import API from "../api/axios";

export default function VideoPlayer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const video = useSelector((s) => s.videos.current);
  const auth = useSelector((s) => s.auth);
  const comments = useSelector((s) => s.comments.list);
  const commentsLoading = useSelector((s) => s.comments.loading);

  const [text, setText] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchVideoById(id));
    dispatch(fetchComments(id));
    API.post(`/videos/${id}/view`).catch(() => {});
  }, [dispatch, id]);

  const currentUserId = useMemo(
    () => auth?.user?._id || auth?.user?.id,
    [auth]
  );

  const isLiked = video?.likedBy?.includes(currentUserId);
  const isDisliked = video?.dislikedBy?.includes(currentUserId);

  const fmt = (n) =>
    n >= 1_000_000
      ? (n / 1_000_000).toFixed(1) + "M"
      : n >= 1_000
      ? (n / 1_000).toFixed(1) + "K"
      : n || 0;

  if (!video) return <div className="p-4">Loading...</div>;

  return (
    /**
     * 🔥 KEY FIX:
     * md:pl-20  -> offset for sidebar (medium + iPad Pro)
     * xl:grid-cols-12 -> side-by-side ONLY on xl+
     */
    <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 md:pl-20">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* ================= VIDEO SECTION ================= */}
        <div className="xl:col-span-8">
          {/* VIDEO */}
          <div className="overflow-hidden bg-black aspect-video rounded-xl">
            <video
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              controls
              className="object-contain w-full h-full"
            />
          </div>

          {/* TITLE */}
          <h1 className="mt-4 text-lg font-semibold sm:text-xl">
            {video.title}
          </h1>

          {/* CHANNEL + ACTIONS */}
          <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <img
                src={video.uploader?.avatar || "https://i.pravatar.cc/40"}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">
                  {video.uploader?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {fmt(video.views)} views
                </p>
              </div>
            </div>

            <button className="px-4 py-2 text-sm text-white bg-black rounded-full sm:ml-4">
              Subscribe
            </button>

            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <ActionBtn active={isLiked}>👍 {fmt(video.likes)}</ActionBtn>
              <ActionBtn active={isDisliked}>
                👎 {fmt(video.dislikes)}
              </ActionBtn>
              <ActionBtn>Share</ActionBtn>
              <ActionBtn>Download</ActionBtn>
              <ActionBtn>Clip</ActionBtn>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-4 text-sm text-gray-700">
            {video.description}
          </p>

          {/* COMMENTS */}
          <div className="mt-6">
            <h3 className="mb-3 font-semibold">Comments</h3>
            <div className="flex gap-3">
              <img
                src={auth?.user?.avatar || "https://i.pravatar.cc/40"}
                className="rounded-full w-9 h-9"
              />
              <div className="flex-1">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={2}
                  placeholder="Add a comment"
                  className="w-full border-b resize-none focus:outline-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() =>
                      dispatch(addComment({ videoId: id, text }))
                    }
                    className="px-4 py-1 text-sm text-white bg-black rounded"
                  >
                    {commentsLoading ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 🔽 UP NEXT BELOW (mobile, md, iPad Pro) */}
          <div className="mt-8 xl:hidden">
            <h3 className="mb-3 font-semibold">Up next</h3>
            <div className="flex gap-3">
              <img
                src={video.thumbnailUrl}
                className="object-cover w-40 h-24 rounded"
              />
              <p className="text-sm line-clamp-2">{video.title}</p>
            </div>
          </div>
        </div>

        {/* ▶️ UP NEXT SIDE (ONLY XL+) */}
        <aside className="hidden xl:block xl:col-span-4">
          <h3 className="mb-3 font-semibold">Up next</h3>
          <div className="flex gap-3">
            <img
              src={video.thumbnailUrl}
              className="object-cover w-40 h-24 rounded"
            />
            <p className="text-sm line-clamp-2">{video.title}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ActionBtn({ children, active }) {
  return (
    <button
      className={`px-3 py-1 text-sm rounded-full border ${
        active ? "bg-black text-white" : "bg-white"
      }`}
    >
      {children}
    </button>
  );
}
