/* frontend/src/App.jsx */
import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelPage from "./pages/ChannelPage";
import CreateVideo from "./pages/CreateVideo";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Enforce zero horizontal overflow on the main content area
  let mainContentClass = "flex-1 min-h-screen pt-14 overflow-x-hidden";

  if (isHomePage) {
    if (sidebarOpen) {
      // Home, XL screen, sidebar open (pushing content)
      mainContentClass += " xl:ml-0 transition-all duration-150";
    } else {
      // Home, XL screen, sidebar closed (compact rail pushing content)
      mainContentClass += " xl:ml-20 transition-all duration-150";
    }
  } else {
    // Non-Home pages: Always overlay, no pushing.
    mainContentClass += " xl:ml-0 md:ml-0";
  }

  // Medium screens (MD) compact rail for Home only
  if (isHomePage && !sidebarOpen) {
    mainContentClass += " md:ml-14";
  }

  return (
    <div className="min-h-screen bg-yc-bg">
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      {/* Set the main flex container to use the full viewport width */}
      <div className="flex w-full">
        <Sidebar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <main className={mainContentClass}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/channel" element={<ChannelPage />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/create-video" element={<CreateVideo />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
