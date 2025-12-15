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
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const menuRef = useRef(null);

  // Load video + comments on id change
  useEffect(() => {
    if (!id) return;
    dispatch(fetchVideoById(id));
    dispatch(fetchComments(id));
    // record view (best-effort)
    API.post(`/videos/${id}/view`).catch(() => {});
    setText("");
    setMenuOpenId(null);
    setEditingId(null);
    setEditingText("");
  }, [dispatch, id]);

  // close comment menus on outside click
  useEffect(() => {
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // helper: current user id
  const currentUserId = useMemo(() => {
    if (!auth?.user) return null;
    return auth.user._id || auth.user.id || auth.user;
  }, [auth]);

  // helper: figure reaction state from video object
  // backend may provide `video.userReaction` OR arrays `likedBy`/`dislikedBy`
  const isLiked = useMemo(() => {
    if (!video || !currentUserId) return false;
    if (video.userReaction) return video.userReaction === "like";
    if (Array.isArray(video.likedBy))
      return video.likedBy.includes(currentUserId);
    return false;
  }, [video, currentUserId]);

  const isDisliked = useMemo(() => {
    if (!video || !currentUserId) return false;
    if (video.userReaction) return video.userReaction === "dislike";
    if (Array.isArray(video.dislikedBy))
      return video.dislikedBy.includes(currentUserId);
    return false;
  }, [video, currentUserId]);

  // UI-friendly number formatting
  const fmtNumber = (n) => {
    if (!n && n !== 0) return "0";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return `${n}`;
  };

  // Like/dislike handlers
  const handleLike = async () => {
    if (!auth?.user) return navigate("/auth");
    if (!video?._id) return;
    try {
      await dispatch(likeVideo(video._id));
      // refresh video counts & reaction
      await dispatch(fetchVideoById(video._id));
    } catch (err) {
      console.error("like failed", err);
    }
  };

  const handleDislike = async () => {
    if (!auth?.user) return navigate("/auth");
    if (!video?._id) return;
    try {
      await dispatch(dislikeVideo(video._id));
      await dispatch(fetchVideoById(video._id));
    } catch (err) {
      console.error("dislike failed", err);
    }
  };

  // Comments logic (kept same as before)
  const postComment = async () => {
    if (!auth?.user) return navigate("/auth");
    const t = (text || "").trim();
    if (!t) return;
    await dispatch(addComment({ videoId: id, text: t }));
    await dispatch(fetchComments(id));
    setText("");
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditingText(c.text || "");
    setMenuOpenId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = async (c) => {
    const newText = (editingText || "").trim();
    if (!newText) return;
    await dispatch(updateComment({ id: c._id, text: newText }));
    await dispatch(fetchComments(id));
    setEditingId(null);
    setEditingText("");
  };

  const ownerIdOf = (c) => c.userId?._id || c.userId || c.user?._id || c.user;
  const isCommentOwner = (c) =>
    currentUserId &&
    ownerIdOf(c) &&
    String(currentUserId) === String(ownerIdOf(c));

  const removeComment = async (c) => {
    if (!isCommentOwner(c)) return;
    if (!confirm("Delete this comment?")) return;
    await dispatch(deleteComment(c._id));
    await dispatch(fetchComments(id));
    setMenuOpenId(null);
  };

  if (!video) return <div className="p-4">Loading...</div>;

  return (
    <div className="py-4 pb-16 md:pb-4">
      {/* Inner Wrapper: Padding only. Allows content to flow full width. */}
      <div className="px-4">
        {/* Grid uses lg:grid-cols-3 (2/3 for video, 1/3 for Up Next). 
            This structure ensures the columns take up the full available width 
            (100% of the space after the left margin, which is handled in App.jsx). */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* video surface: Takes 2/3 of the available space */}
            <div className="overflow-hidden bg-black rounded">
              <video
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                controls
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            <h1 className="mt-4 text-2xl font-semibold">{video.title}</h1>

            {/* uploader + actions row */}
            <div className="flex items-center gap-4 mt-3">
              {/* uploader */}
              <div className="flex items-center gap-3">
                <img
                  src={video.uploader?.avatar || "https://i.pravatar.cc/40"}
                  alt={video.uploader?.username || "Uploader"}
                  className="rounded-full w-11 h-11"
                />
                <div>
                  <div className="font-medium">
                    {video.uploader?.username || video.channel?.channelName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {fmtNumber(video.views || 0)} views •{" "}
                    {new Date(
                      video.uploadDate || video.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Subscribe button (prominent) */}
              <div className="ml-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full shadow-sm hover:brightness-95"
                  title="Subscribe"
                  // TODO: wire subscribe action if you have one
                >
                  Subscribe
                </button>
              </div>

              {/* action buttons group */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Like */}
                <button
                  onClick={handleLike}
                  aria-pressed={isLiked}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                    isLiked
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  title="Like"
                >
                  {/* thumbs-up icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M2 21h4V9H2v12zM22 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 7.59 6.59C7.22 6.95 7 7.45 7 8v9c0 1.1.9 2 2 2h7c.83 0 1.54-.5 1.84-1.22L22 10z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {fmtNumber(video.likes || 0)}
                  </span>
                </button>

                {/* Dislike */}
                <button
                  onClick={handleDislike}
                  aria-pressed={isDisliked}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                    isDisliked
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  title="Dislike"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M22 3h-4v12h4V3zM2 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L10.83 23l5.58-5.59c.37-.36.59-.86.59-1.41V7c0-1.1-.9-2-2-2H7c-.83 0-1.54.5-1.84 1.22L2 14z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {fmtNumber(video.dislikes || 0)}
                  </span>
                </button>

                {/* Share */}
                <button
                  title="Share"
                  className="items-center hidden gap-2 px-3 py-1 text-gray-700 bg-white border rounded-full sm:flex hover:bg-gray-50"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Link copied");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.02-4.11A2.99 2.99 0 1014 5a2.99 2.99 0 001.96.77L9 10.58 7.02 9.38A3.001 3.001 0 1011 7a3 3 0 00-1.96-.77L16.07 10.5c.05.23.09.46.09.7s-.04.47-.09.7L11.04 15.8c.77.44 1.32 1.23 1.32 2.2 0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3c.57 0 1.09.18 1.52.48L17.02 9.4A3 3 0 1018 16.08z" />
                  </svg>
                  <span className="text-sm font-medium">Share</span>
                </button>

                {/* Download */}
                <button
                  title="Download"
                  className="items-center hidden gap-2 px-3 py-1 text-gray-700 bg-white border rounded-full sm:flex hover:bg-gray-50"
                  onClick={() => {
                    /* implement download */ alert("Download not implemented");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.92v6h4.5V9h3.92L12 2z" />
                  </svg>
                  <span className="text-sm font-medium">Download</span>
                </button>

                {/* Clip */}
                <button
                  title="Clip"
                  className="items-center hidden gap-2 px-3 py-1 text-gray-700 bg-white border rounded-full sm:flex hover:bg-gray-50"
                  onClick={() => alert("Clip not implemented")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M10 9V5l-7 7 7 7v-4h8V9h-8z" />
                  </svg>
                  <span className="text-sm font-medium">Clip</span>
                </button>
              </div>
            </div>

            {/* description */}
            <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
              {video.description}
            </p>

            {/* comments */}
            <div className="mt-6">
              <h3 className="font-semibold">Comments</h3>

              {/* add comment box */}
              <div className="flex items-start gap-3 mt-3">
                <img
                  src={auth?.user?.avatar || "https://i.pravatar.cc/40"}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-2 border rounded resize-none"
                    rows={2}
                    placeholder={
                      auth?.user
                        ? "Add a public comment..."
                        : "Sign in to comment"
                    }
                    disabled={!auth?.user}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setText("")}
                      className="px-4 py-1 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={postComment}
                      className="px-4 py-1 text-white bg-black rounded"
                      disabled={!auth?.user || !text.trim()}
                    >
                      {commentsLoading ? "Posting..." : "Comment"}
                    </button>
                  </div>
                </div>
              </div>

              {/* comments list */}
              <ul className="mt-4 space-y-3">
                {comments.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                )}

                {comments.map((c) => {
                  const isMy = isCommentOwner(c);
                  return (
                    <li key={c._id} className="p-3 bg-white rounded shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <img
                            src={c.userId?.avatar || "https://i.pravatar.cc/40"}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium">
                              {c.userId?.username ||
                                c.user?.username ||
                                "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                c.timestamp || c.createdAt || Date.now()
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="relative" ref={menuRef}>
                          <button
                            onClick={() =>
                              setMenuOpenId(menuOpenId === c._id ? null : c._id)
                            }
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <svg
                              className="w-5 h-5 text-gray-600"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                          {menuOpenId === c._id && (
                            <div className="absolute right-0 z-50 w-48 mt-2 bg-white border rounded shadow-md">
                              {isMy && (
                                <button
                                  onClick={() => startEdit(c)}
                                  className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                                >
                                  Edit
                                </button>
                              )}
                              {isMy && (
                                <button
                                  onClick={() => removeComment(c)}
                                  className="block w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-50"
                                >
                                  Delete
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  navigator.clipboard?.writeText(
                                    window.location.href + `#comment-${c._id}`
                                  );
                                  setMenuOpenId(null);
                                }}
                                className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                              >
                                Copy link
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2">
                        {editingId === c._id ? (
                          <div>
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              rows={3}
                              className="w-full p-2 border rounded"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 border rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveEdit(c)}
                                className="px-3 py-1 text-white bg-black rounded"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm">{c.text}</div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* right rail - up next: Takes 1/3 of the available space */}
          <aside>
            <div className="p-3 bg-white rounded shadow-sm">
              <h3 className="font-semibold">Up next</h3>
              <div className="mt-2 space-y-2">
                {/* You might want to map over an actual list of related videos here */}
                <div className="flex items-center gap-2">
                  <img
                    src={video.thumbnailUrl}
                    alt=""
                    className="object-cover w-24 rounded h-14"
                  />
                  <div className="text-sm line-clamp-2">{video.title}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
