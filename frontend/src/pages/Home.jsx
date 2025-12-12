// frontend/src/pages/Home.jsx
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import { fetchVideos } from "../store/VideoSlice";

/*
  Home:
  - if not auth: shows "Try searching" static card
  - if auth: fetch videos & render feed; only .feed-scroll is scrollable
  - uses a layout-measure approach so the feed gets the remaining viewport height
*/

export default function Home() {
  const dispatch = useDispatch();
  const videos = useSelector((s) => s.videos.list);
  const loading = useSelector((s) => s.videos.loading);
  const error = useSelector((s) => s.videos.error);
  const auth = useSelector((s) => s.auth);

  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const [category, setCategory] = useState("All");

  const categoryList = ["All","Web Development","JavaScript","Data Structures","Server","Music","Information Technology","Resume","Gaming","Live"];

  const filtersRef = useRef(null);
  const feedRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!auth || !auth.user) return;
    dispatch(fetchVideos({ q: qParam || undefined, category }));
  }, [dispatch, qParam, category, auth]);

  // Compute available height for feedRef so only it scrolls
  useLayoutEffect(() => {
    function setFeedHeight() {
      if (!feedRef.current || !containerRef.current) return;
      // top of container (below header)
      const containerRect = containerRef.current.getBoundingClientRect();
      const available = window.innerHeight - containerRect.top - 16; // 16px bottom gap
      feedRef.current.style.height = `${Math.max(120, available)}px`;
    }

    setFeedHeight();
    window.addEventListener("resize", setFeedHeight);
    window.addEventListener("orientationchange", setFeedHeight);
    // also recalc after fonts/images load
    const ro = new ResizeObserver(setFeedHeight);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", setFeedHeight);
      window.removeEventListener("orientationchange", setFeedHeight);
      ro.disconnect();
    };
  }, [filtersRef, feedRef]);

  // Not authenticated view (static)
  if (!auth || !auth.user) {
    return (
      <div ref={containerRef} className="p-6 main-content">
        <div ref={filtersRef} className="flex gap-3 mb-6 overflow-x-auto">
          {categoryList.map((ch) => (
            <button key={ch} onClick={() => setCategory(ch)} className={`px-3 py-1 rounded-full border ${category === ch ? "bg-black text-white" : "bg-white"}`}>{ch}</button>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <div className="w-full max-w-3xl p-8 text-center bg-white rounded-lg shadow-xl">
            <h2 className="mb-3 text-2xl font-bold">Try searching to get started</h2>
            <p className="text-gray-600">Start watching videos to help us build a feed of videos that you'll love.</p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated view: filters on top, feed-scroll below (scrollable)
  return (
    <div ref={containerRef} className="flex-1 p-6 main-content">
      <div ref={filtersRef} className="flex gap-3 mb-4 overflow-x-auto">
        {categoryList.map((ch) => (
          <button key={ch} onClick={() => setCategory(ch)} className={`px-3 py-1 rounded-full border ${category === ch ? "bg-black text-white" : "bg-white"}`}>{ch}</button>
        ))}
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="p-3 text-red-700 border border-red-100 rounded bg-red-50">
            {`Unable to load videos from backend: ${error}. Please check the backend server.`}
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center">Loading videos...</div>
      ) : (!videos || videos.length === 0) ? (
        <div className="flex justify-center">
          <div className="w-full max-w-3xl p-8 text-center bg-white rounded-lg shadow-xl">
            <h2 className="mb-3 text-2xl font-bold">Try searching to get started</h2>
            <p className="text-gray-600">Start watching videos to help us build a feed of videos that you'll love.</p>
          </div>
        </div>
      ) : (
        <div
          ref={feedRef}
          className="overflow-auto feed-scroll"
          style={{ paddingRight: 8 }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
