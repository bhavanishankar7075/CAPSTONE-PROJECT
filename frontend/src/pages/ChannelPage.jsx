// frontend/src/pages/ChannelPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannelById } from "../store/channelsSlice";
import API from "../api/axios";
import CreateChannelModal from "../components/CreateChannelModal";
import { setUser } from "../store/authSlice";

/**
 * ChannelPage (robust)
 * - normalizes channel ids (strings or populated objects)
 * - refreshes user from backend to avoid re-opening create modal on reload
 * - safe three-dots menu per video with outside click close
 * - ensures dropdowns are visible (parent containers use overflow-visible)
 * - scrolls to top on mount so header dropdown renders below header
 */

function extractChannelId(maybe) {
  if (!maybe) return null;
  if (typeof maybe === "string") return maybe;
  if (typeof maybe === "object") return maybe._id || maybe.id || null;
  return null;
}

export default function ChannelPage() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const channel = useSelector((s) => s.channels.current);
  const auth = useSelector((s) => s.auth);

  const [loadingDelete, setLoadingDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("Videos");
  const [sortBy, setSortBy] = useState("Latest");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // which video menu (three-dots) is open
  const [openMenuFor, setOpenMenuFor] = useState(null);

  // localStorage fallback in case redux hasn't hydrated yet
  const localUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  // effectiveUser may be from redux or localStorage
  const effectiveUser = auth?.user || localUser;

  // normalize first channel entry (handles populated objects)
  const firstChannelEntry = effectiveUser?.channels?.[0] || effectiveUser?.channelId || null;
  const normalizedFirstChannelId = extractChannelId(firstChannelEntry);
  const resolvedId = paramId || normalizedFirstChannelId || null;

  // close video menus on outside clicks
  useEffect(() => {
    function onDocClick(e) {
      if (!e.target.closest("[data-menu]")) {
        setOpenMenuFor(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // When the channel page mounts or resolvedId changes:
  // - if we have resolvedId, fetch channel
  // - otherwise, refresh user from backend (so channels array is populated) and then fetch
  // - if still no channel after refresh -> open create modal for signed in users
  useEffect(() => {
    let cancelled = false;

    const tryRefreshUserAndChannel = async () => {
      // ensure page is scrolled to top so header dropdown doesn't overlap awkwardly
      try { window.scrollTo({ top: 0, behavior: "auto" }); } catch (e) {}

      if (resolvedId) {
        // resolved ID guaranteed to be a string here
        dispatch(fetchChannelById(resolvedId));
        setCreateModalOpen(false);
        return;
      }

      // if no user at all -> go to auth page
      if (!effectiveUser) {
        navigate("/auth");
        return;
      }

      // try refresh user from backend to get fresh channels (useful after create)
      if (effectiveUser?._id) {
        try {
          const res = await API.get(`/users/${effectiveUser._id}`);
          const freshUser = res.data?.user ?? res.data;
          if (!cancelled && freshUser) {
            // normalize channels to id strings (handle populated results)
            const normalized = { ...freshUser };
            if (Array.isArray(normalized.channels)) {
              normalized.channels = normalized.channels.map((c) => extractChannelId(c)).filter(Boolean);
            }

            // update redux + localStorage via setUser
            dispatch(setUser(normalized));
            try { localStorage.setItem("user", JSON.stringify(normalized)); } catch (e) {}

            const newId = normalized.channels?.[0] || normalized.channelId || null;
            if (newId) {
              await dispatch(fetchChannelById(newId));
              setCreateModalOpen(false);
              return;
            }
          }
        } catch (err) {
          // ignore — we'll open create modal below
        }
      }

      // no channel found for this user -> open create modal (user is signed in)
      if (!cancelled) setCreateModalOpen(true);
    };

    tryRefreshUserAndChannel();

    return () => { cancelled = true; };
  }, [dispatch, resolvedId, effectiveUser, navigate]);

  // is the current user the owner of this channel?
  const isOwner = useMemo(() => {
    if (!effectiveUser || !channel) return false;
    const userId = effectiveUser._id || effectiveUser.id || effectiveUser;
    const ownerId = channel.owner?._id || channel.owner;
    return String(userId) === String(ownerId);
  }, [effectiveUser, channel]);

  // videos sorted according to sortBy
  const videos = useMemo(() => {
    if (!channel?.videos) return [];
    const arr = [...channel.videos];
    if (sortBy === "Latest") {
      arr.sort((a, b) => new Date(b.uploadDate || b.createdAt || 0) - new Date(a.uploadDate || a.createdAt || 0));
    } else if (sortBy === "Oldest") {
      arr.sort((a, b) => new Date(a.uploadDate || a.createdAt || 0) - new Date(b.uploadDate || b.createdAt || 0));
    } else if (sortBy === "Popular") {
      arr.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return arr;
  }, [channel?.videos, sortBy]);

  const fmtNumber = (n) => {
    if (n == null) return "0";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return `${n}`;
  };

  // delete video helper used by both direct buttons and menu
  const handleDelete = async (vidId) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    setLoadingDelete(vidId);
    try {
      await API.delete(`/videos/${vidId}`);
      if (resolvedId) await dispatch(fetchChannelById(resolvedId));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setLoadingDelete(null);
    }
  };

  const openCreateModal = () => setCreateModalOpen(true);

  // show loading indicator while channel is being fetched
  if (!channel && resolvedId) {
    return (
      <div className="min-h-screen bg-yc-bg">
        <div className="max-w-[1200px] mx-auto p-6">
          <div className="py-24 text-center text-gray-600">Loading channel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yc-bg">
      {!channel ? (
        <div className="max-w-[1200px] mx-auto p-6">
          <div className="py-24 text-center text-gray-600">
            {effectiveUser ? (
              <>
                You don't have a channel yet.{" "}
                <button onClick={openCreateModal} className="px-3 py-1 ml-2 text-white bg-black rounded">Create channel</button>
              </>
            ) : (
              <>Please sign in to view or create a channel.</>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-[1200px] mx-auto pb-12">
          {/* Banner */}
          <div className="mt-6">
            <div
              className="w-full bg-center bg-cover rounded-lg shadow-sm h-44 md:h-52"
              style={{ backgroundImage: `url(${channel.channelBanner || "https://picsum.photos/seed/channel-banner/1200/300"})` }}
            />
          </div>

          {/* Channel header row */}
          <div className="flex flex-col items-start gap-4 mt-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <img
                src={
                  channel.owner?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.channelName || "C")}&background=0D8ABC&color=fff`
                }
                alt={channel.channelName}
                className="object-cover border rounded-full w-28 h-28 md:w-32 md:h-32"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{channel.channelName}</h1>
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2l1.9 2.9 3.4.5-2.45 2.2.6 3.4L12 10.8 8.55 11.0l.6-3.4L6.7 5.4l3.4-.5L12 2z" />
                </svg>
              </div>

              <div className="mt-1 text-sm text-gray-600">
                @{channel.owner?.username || (channel.owner && channel.owner.username) || "channelhandle"} •{" "}
                <span className="font-medium">{fmtNumber(channel.subscribers)} subscribers</span>
              </div>

              {channel.description && (
                <div className="max-w-3xl mt-3 text-sm text-gray-700">
                  {channel.description}
                </div>
              )}

              {/* links / actions */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <button className="px-4 py-1 text-white bg-black rounded-full">Subscribe</button>
                <button className="px-3 py-1 border rounded">About</button>
                <button className="px-3 py-1 border rounded">Community</button>
                {isOwner && (
                  <button onClick={openCreateModal} className="px-3 py-1 border rounded">Create / Edit channel</button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs nav */}
          <div className="mt-6 border-b">
            <nav className="flex items-end gap-6">
              {["Home", "Videos", "Shorts", "Live", "Playlists", "Community"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-3 ${activeTab === t ? "border-b-2 border-black font-semibold" : "text-gray-600"}`}
                >
                  {t}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div className="mt-6">
            {activeTab !== "Videos" && (
              <div className="p-8 text-gray-600 bg-white rounded shadow-sm">
                This tab's content is not implemented in the capstone — only the Videos tab shows video listings.
              </div>
            )}

            {/* Videos tab */}
            {activeTab === "Videos" && (
              <>
                {/* Sort / Filter row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-700">Sort by:</div>
                    {["Latest", "Popular", "Oldest"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSortBy(s)}
                        className={`text-sm px-3 py-1 rounded-full ${sortBy === s ? "bg-black text-white" : "border text-gray-700"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="text-sm text-gray-500">{videos.length} videos</div>
                </div>

                {/* Video grid (parent overflow-visible so menus render) */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {videos.map((v) => (
                    <div key={v._id} className="overflow-visible bg-white rounded shadow-sm">
                      <div className="relative cursor-pointer" onClick={() => navigate(`/video/${v._id}`)}>
                        <img
                          src={v.thumbnailUrl || `https://picsum.photos/seed/${v._id}/400/225`}
                          alt={v.title}
                          className="object-cover w-full h-48 rounded-t"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                          {Math.floor((v.durationSeconds || (v.duration || 0)) / 60)}:{String((v.durationSeconds || 0) % 60).padStart(2, "0")}
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          <img src={channel.owner?.avatar || v.uploader?.avatar || "https://i.pravatar.cc/40"} alt="" className="object-cover w-10 h-10 rounded-full" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium line-clamp-2">{v.title}</div>
                            <div className="mt-1 text-xs text-gray-500">{v.uploader?.username || channel.channelName}</div>
                            <div className="text-xs text-gray-500">{fmtNumber(v.views || 0)} views • {new Date(v.uploadDate || v.createdAt || Date.now()).toLocaleDateString()}</div>
                          </div>

                          {/* owner actions: three-dots menu */}
                          {isOwner && (
                            <div data-menu className="relative flex-shrink-0 ml-2">
                              <button
                                data-menu-button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuFor((cur) => (cur === v._id ? null : v._id));
                                }}
                                className="p-1 border rounded hover:bg-gray-50"
                                aria-label="More"
                                title="More"
                              >
                                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/></svg>
                              </button>

                              {openMenuFor === v._id && (
                                <div
                                  className="absolute z-50 w-40 py-1 translate-y-2 bg-white border rounded-md shadow-lg right-3 top-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => {
                                      setOpenMenuFor(null);
                                      navigate(`/video/${v._id}`);
                                    }}
                                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => handleDelete(v._id)}
                                    className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-50"
                                  >
                                    {loadingDelete === v._id ? "Deleting..." : "Delete"}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Channel modal */}
      {createModalOpen && (
        <CreateChannelModal
          onClose={async () => {
            setCreateModalOpen(false);
            try {
              const stored = JSON.parse(localStorage.getItem("user") || "null");
              const newId = paramId || extractChannelId(stored?.channels?.[0]) || stored?.channelId;
              if (newId) await dispatch(fetchChannelById(newId));
            } catch (e) {
              // ignore
            }
          }}
        />
      )}
    </div>
  );
}
