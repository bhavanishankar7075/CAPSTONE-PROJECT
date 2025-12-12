/* frontend/src/App.jsx */
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelPage from "./pages/ChannelPage";
import CreateVideo from "./pages/CreateVideo";

/*
  App holds the sidebar open/collapsed state and passes handlers down.
*/
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen bg-yc-bg">
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} />
        <main className="flex-1 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            {/* view your own channel: ChannelPage will resolve auth user channel when no :id */}
            <Route path="/channel" element={<ChannelPage />} />
            {/* view specific channel */}
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/create-video" element={<CreateVideo />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
