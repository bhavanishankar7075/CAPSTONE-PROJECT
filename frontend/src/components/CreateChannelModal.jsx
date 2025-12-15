// frontend/src/components/CreateChannelModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChannel } from "../store/channelsSlice";
import { setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

/**
 * CreateChannelModal
 * - Design/responsiveness improvements only. Functional logic unchanged.
 */

function normalizeUserChannels(user) {
  if (!user) return user;
  const copy = { ...user };
  if (Array.isArray(copy.channels)) {
    copy.channels = copy.channels
      .map((c) => {
        if (!c) return null;
        if (typeof c === "string") return c;
        if (typeof c === "object") return c._id || c.id || null;
        return null;
      })
      .filter(Boolean);
  }
  return copy;
}

function extractFirstChannelId(user) {
  if (!user) return null;
  const first = user.channels?.[0] ?? user.channelId ?? null;
  if (!first) return null;
  if (typeof first === "string") return first;
  if (typeof first === "object") return first._id || first.id || null;
  return null;
}

export default function CreateChannelModal({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((s) => s.auth);
  const me =
    auth?.user ||
    (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        return null;
      }
    })();

  const initialName = me?.username ? `${me.username}'s Channel` : "";
  const [channelName, setChannelName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  // avatar file preview (local only)
  const [avatarPreview, setAvatarPreview] = useState(me?.avatar || null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!me) return;
    setAvatarPreview(me.avatar || null);
    // initialize suggested name
    if (!channelName && me.username) setChannelName(`${me.username}'s Channel`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  const onFileSelected = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    onFileSelected(file);
    // NOTE: client-only preview — we don't upload avatar here.
  };

  const triggerFilePicker = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleCreate = async () => {
    if (!channelName || !channelName.trim()) {
      alert("Please enter a channel name.");
      return;
    }

    setLoading(true);
    try {
      const payload = { channelName: channelName.trim() };
      const action = await dispatch(createChannel(payload));
      // RTK returns an action object; handle errors defensively
      if (action.error) throw action.payload || action.error;

      const data = action.payload; // expected { channel, user }

      // If backend returned a user object, normalize and store it
      if (data?.user) {
        const normalized = normalizeUserChannels(data.user);
        try {
          localStorage.setItem("user", JSON.stringify(normalized));
        } catch (e) {
          /* ignore */
        }
        dispatch(setUser(normalized));
      } else if (data?.channel && me) {
        // fallback: update localStorage manually
        try {
          const stored = JSON.parse(localStorage.getItem("user") || "null");
          if (stored) {
            stored.channels = stored.channels || [];
            // ensure channels are id strings
            stored.channels = stored.channels
              .map((c) => (typeof c === "string" ? c : c?._id || c?.id || null))
              .filter(Boolean);
            if (
              !stored.channels.find(
                (c) => String(c) === String(data.channel._id)
              )
            ) {
              stored.channels.unshift(data.channel._id);
              try {
                localStorage.setItem("user", JSON.stringify(stored));
              } catch (e) {}
              dispatch(setUser(stored));
            } else {
              // still update setUser in case other fields changed
              dispatch(setUser(stored));
            }
          }
        } catch (e) {
          // ignore parse error
        }
      }

      if (onClose) onClose();

      // determine new channel id safely and navigate
      const newChannelId =
        data?.channel?._id ||
        extractFirstChannelId(data?.user) ||
        extractFirstChannelId(me);
      if (newChannelId) navigate(`/channel/${newChannelId}`);
    } catch (err) {
      console.error("create channel failed", err);
      alert(
        err?.message ||
          (err?.payload && JSON.stringify(err.payload)) ||
          "Failed to create channel"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // backdrop + centered modal container
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-14 sm:pt-20"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-channel-title"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 transition-opacity bg-black/50"
        onClick={() => {
          if (!loading && onClose) onClose();
        }}
        aria-hidden="true"
      />

      {/* modal */}
      <div
        className="relative z-10 w-full max-w-lg p-5 mx-auto overflow-y-auto transition-all transform bg-white shadow-xl sm:max-w-2xl rounded-2xl sm:p-6 md:p-8"
        style={{ maxHeight: "86vh" }}
      >
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="create-channel-title"
              className="text-lg font-semibold leading-tight sm:text-2xl"
            >
              How you'll appear
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm max-w-prose">
              A simple profile for your channel. You can change it later.
            </p>
          </div>

          {/* close button */}
          <button
            type="button"
            onClick={() => {
              if (!loading && onClose) onClose();
            }}
            aria-label="Close create channel modal"
            className="p-2 transition rounded-md hover:bg-gray-100 active:scale-95"
            disabled={loading}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-3">
          {/* left column: avatar */}
          <div className="flex flex-col items-center gap-3 sm:col-span-1">
            <div className="relative w-24 h-24 overflow-hidden border rounded-full sm:w-28 sm:h-28 lg:w-32 lg:h-32">
              <img
                src={
                  avatarPreview ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    me?.username || "User"
                  )}&background=0D8ABC&color=fff`
                }
                alt="avatar preview"
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={triggerFilePicker}
                className="px-3 py-1 text-sm underline transition rounded-md sm:text-sm hover:no-underline hover:bg-gray-50"
                disabled={loading}
              >
                Select picture
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="mt-2 text-xs text-gray-400 text-center max-w-[10rem] sm:max-w-xs">
                Avatar is local preview only (no upload in this modal).
              </p>
            </div>
          </div>

          {/* right column: inputs */}
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-700">Name</label>
            <input
              className="w-full p-3 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="Channel name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              disabled={loading}
            />

            <div className="mt-4">
              <label className="block text-sm text-gray-700">Handle</label>
              <input
                className="w-full p-3 mt-2 text-gray-700 border rounded-lg bg-gray-50"
                value={
                  me?.username
                    ? `@${String(me.username).replace(/\s+/g, "")}`
                    : ""
                }
                readOnly
              />
            </div>

            <div className="mt-4 text-sm text-gray-500">
              By clicking <span className="font-medium">Create channel</span>{" "}
              you agree to the project rules. This modal is a simplified UI for
              the capstone.
            </div>
          </div>
        </div>

        {/* actions - responsive */}
        <div className="flex flex-col-reverse items-center gap-3 mt-6 sm:mt-8 sm:flex-row sm:justify-end">
          <button
            onClick={() => {
              if (!loading && onClose) onClose();
            }}
            className="w-full px-4 py-2 transition bg-white border rounded-lg sm:w-auto hover:bg-gray-50 disabled:opacity-60"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center w-full px-4 py-2 font-medium text-white transition bg-blue-600 rounded-lg sm:w-auto hover:brightness-105 active:scale-95 disabled:opacity-60"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Creating..." : "Create channel"}
          </button>
        </div>
      </div>
    </div>
  );
}
