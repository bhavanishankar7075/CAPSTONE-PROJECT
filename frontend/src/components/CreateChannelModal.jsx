// frontend/src/components/CreateChannelModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChannel } from "../store/channelsSlice";
import { setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

/**
 * CreateChannelModal
 * - simplified: only Channel name + avatar preview + handle
 * - client-side avatar preview (no server upload)
 * - expects backend to return { channel, user }
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
  const me = auth?.user || (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
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
        try { localStorage.setItem("user", JSON.stringify(normalized)); } catch (e) { /* ignore */ }
        dispatch(setUser(normalized));
      } else if (data?.channel && me) {
        // fallback: update localStorage manually
        try {
          const stored = JSON.parse(localStorage.getItem("user") || "null");
          if (stored) {
            stored.channels = stored.channels || [];
            // ensure channels are id strings
            stored.channels = stored.channels.map((c) => (typeof c === "string" ? c : (c?._id || c?.id || null))).filter(Boolean);
            if (!stored.channels.find((c) => String(c) === String(data.channel._id))) {
              stored.channels.unshift(data.channel._id);
              try { localStorage.setItem("user", JSON.stringify(stored)); } catch (e) {}
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
      alert(err?.message || (err?.payload && JSON.stringify(err.payload)) || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => { if (!loading && onClose) onClose(); }}
      />

      <div
        className="relative z-10 w-full p-6 overflow-auto bg-white rounded-lg shadow-lg"
        style={{ maxWidth: "720px", maxHeight: "80vh" }}
      >
        <h2 className="mb-4 text-2xl font-semibold">How you'll appear</h2>

        <div className="flex flex-col items-center gap-3">
          <div className="overflow-hidden border rounded-full w-28 h-28 md:w-32 md:h-32">
            <img
              src={
                avatarPreview ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(me?.username || "User")}&background=0D8ABC&color=fff`
              }
              alt="avatar"
              className="object-cover w-full h-full"
            />
          </div>

          <button type="button" onClick={triggerFilePicker} className="text-sm text-blue-600 hover:underline">
            Select picture
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <div className="mt-5">
          <label className="text-sm text-gray-600">Name</label>
          <input
            className="w-full p-3 mt-1 border rounded focus:outline-none"
            placeholder="Channel name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-600">Handle</label>
          <input
            className="w-full p-3 mt-1 border rounded bg-gray-50"
            value={me?.username ? `@${String(me.username).replace(/\s+/g, "")}` : ""}
            readOnly
          />
        </div>

        <div className="mt-4 text-sm text-gray-500">
          By clicking Create Channel you agree to the project rules. This modal is a simplified UI for the capstone.
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => { if (!loading && onClose) onClose(); }}
            className="px-4 py-2 border rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-white bg-blue-600 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create channel"}
          </button>
        </div>
      </div>
    </div>
  );
}
