/* frontend/src/pages/CreateVideo.jsx */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels } from "../store/channelsSlice";
import { createVideo } from "../store/VideoSlice";
import { useNavigate } from "react-router-dom";

export default function CreateVideo() {
  const dispatch = useDispatch();
  const channels = useSelector(s => s.channels.list);
  const auth = useSelector(s => s.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", thumbnailUrl: "", videoUrl: "", description: "", category: "General", channelId: ""
  });

  useEffect(() => { dispatch(fetchChannels()); }, [dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    if (!auth.user) return alert("Sign in required");
    const res = await dispatch(createVideo(form));
    if (res.type.endsWith("fulfilled")) {
      alert("Uploaded successfully");
      navigate("/");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Upload Video</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" required className="p-2 border rounded" />
          <input value={form.thumbnailUrl} onChange={(e)=>setForm({...form, thumbnailUrl:e.target.value})} placeholder="Thumbnail URL" className="p-2 border rounded" />
          <input value={form.videoUrl} onChange={(e)=>setForm({...form, videoUrl:e.target.value})} placeholder="Video URL (mp4 link)" required className="p-2 border rounded" />
          <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} placeholder="Description" className="p-2 border rounded" />
          <select value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="p-2 border rounded">
            <option>General</option>
            <option>Programming</option>
            <option>React</option>
            <option>Node</option>
            <option>Music</option>
          </select>
          <select value={form.channelId} onChange={(e)=>setForm({...form, channelId:e.target.value})} className="p-2 border rounded">
            <option value="">Select channel</option>
            {channels.map(c => <option key={c._id} value={c._id}>{c.channelName}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="submit" className="bg-yc-brand text-white px-4 py-2 rounded">Upload</button>
            <button type="button" onClick={()=>navigate("/")} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
