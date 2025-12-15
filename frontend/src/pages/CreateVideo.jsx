/* frontend/src/pages/CreateVideo.jsx */
import React, { useEffect, useState } from "react";
// Imports for Redux store interaction
import { useDispatch, useSelector } from "react-redux";
// Imports for asynchronous data fetching and submission
import { fetchChannels } from "../store/channelsSlice";
import { createVideo } from "../store/VideoSlice";
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation

export default function CreateVideo() {
  const dispatch = useDispatch();
  // Select data from the Redux store
  const channels = useSelector(s => s.channels.list);
  const auth = useSelector(s => s.auth);
  const navigate = useNavigate();

  // Local state to manage form input values
  const [form, setForm] = useState({
    title: "", thumbnailUrl: "", videoUrl: "", description: "", category: "General", channelId: ""
  });

  // Effect to fetch all channels when the component mounts
  useEffect(() => { 
    dispatch(fetchChannels()); 
  }, [dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    // Basic authentication check
    if (!auth.user) return alert("Sign in required");

    // Dispatch the action to create the video
    const res = await dispatch(createVideo(form));

    // Handle the result of the async thunk
    if (res.type.endsWith("fulfilled")) {
      alert("Uploaded successfully");
      navigate("/"); // Navigate to home on success
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl p-4 bg-white rounded shadow">
        <h2 className="mb-3 text-xl font-semibold">Upload Video</h2>
        {/* Form submission handler */}
        <form onSubmit={submit} className="flex flex-col gap-3">
          {/* Input fields, controlled by local state (form) */}
          <input 
            value={form.title} 
            onChange={(e)=>setForm({...form, title:e.target.value})} 
            placeholder="Title" required 
            className="p-2 border rounded" 
          />
          <input 
            value={form.thumbnailUrl} 
            onChange={(e)=>setForm({...form, thumbnailUrl:e.target.value})} 
            placeholder="Thumbnail URL" 
            className="p-2 border rounded" 
          />
          <input 
            value={form.videoUrl} 
            onChange={(e)=>setForm({...form, videoUrl:e.target.value})} 
            placeholder="Video URL (mp4 link)" required 
            className="p-2 border rounded" 
          />
          <textarea 
            value={form.description} 
            onChange={(e)=>setForm({...form, description:e.target.value})} 
            placeholder="Description" 
            className="p-2 border rounded" 
          />
          
          {/* Category Dropdown */}
          <select 
            value={form.category} 
            onChange={(e)=>setForm({...form, category:e.target.value})} 
            className="p-2 border rounded"
          >
            <option>General</option>
            <option>Programming</option>
            <option>React</option>
            <option>Node</option>
            <option>Music</option>
          </select>

          {/* Channel Selection Dropdown (populated from Redux store/API) */}
          <select 
            value={form.channelId} 
            onChange={(e)=>setForm({...form, channelId:e.target.value})} 
            className="p-2 border rounded"
          >
            <option value="">Select channel</option>
            {/* Map through fetched channels */}
            {channels.map(c => 
              <option key={c._id} value={c._id}>{c.channelName}</option>
            )}
          </select>
          
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 text-white rounded bg-yc-brand">Upload</button>
            {/* Cancel button navigates back to the home page */}
            <button type="button" onClick={()=>navigate("/")} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}