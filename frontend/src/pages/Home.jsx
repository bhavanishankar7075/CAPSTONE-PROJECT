import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import { fetchVideos } from "../store/VideoSlice";
import "../styles/Home.css";

export default function Home() {
  const dispatch = useDispatch();
  const videos = useSelector((s) => s.videos.list);
  const loading = useSelector((s) => s.videos.loading);
  const error = useSelector((s) => s.videos.error);
  const auth = useSelector((s) => s.auth);

  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const [category, setCategory] = useState("All");

  const categoryList = [
    "All",
    "Web Development",
    "JavaScript",
    "Data Structures",
    "Server",
    "Music",
    "Information Technology",
    "Resume",
    "Gaming",
    "Live",
    "React",
    "Node.js",
    "Full Stack",
  ];

  const filtersRef = useRef(null);
  const feedRef = useRef(null);
  const containerRef = useRef(null);
  const filtersWrapRef = useRef(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    if (!auth || !auth.user) return;
    dispatch(fetchVideos({ q: qParam || undefined, category }));
  }, [dispatch, qParam, category, auth]);

  useLayoutEffect(() => {
    function setFeedHeight() {
      if (!feedRef.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const available = window.innerHeight - containerRect.top - 16;
      feedRef.current.style.height = `${Math.max(120, available)}px`;
    }

    setFeedHeight();
    window.addEventListener("resize", setFeedHeight);
    window.addEventListener("orientationchange", setFeedHeight);
    const ro = new ResizeObserver(setFeedHeight);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", setFeedHeight);
      window.removeEventListener("orientationchange", setFeedHeight);
      ro.disconnect();
    };
  }, [filtersRef, feedRef]);

  // Check scroll position and update arrow visibility
  const updateArrows = () => {
    const el = filtersRef.current;
    const wrapEl = filtersWrapRef.current;
    
    if (!el || !wrapEl) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      if (wrapEl) {
        wrapEl.classList.remove('has-left-arrow', 'has-right-arrow');
      }
      return;
    }

    // Check if content is wider than container (scrollable)
    const isScrollable = el.scrollWidth > el.clientWidth + 5;
    
    if (!isScrollable) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      wrapEl.classList.remove('has-left-arrow', 'has-right-arrow');
      return;
    }

    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;

    const showLeft = scrollLeft > 10;
    const showRight = scrollLeft < maxScroll - 10;

    setShowLeftArrow(showLeft);
    setShowRightArrow(showRight);
    
    // Update wrapper classes for padding
    if (showLeft) {
      wrapEl.classList.add('has-left-arrow');
    } else {
      wrapEl.classList.remove('has-left-arrow');
    }
    
    if (showRight) {
      wrapEl.classList.add('has-right-arrow');
    } else {
      wrapEl.classList.remove('has-right-arrow');
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateArrows, 50);

    const el = filtersRef.current;
    if (el) {
      el.addEventListener("scroll", updateArrows);
    }

    window.addEventListener("resize", updateArrows);
    const ro = new ResizeObserver(updateArrows);
    if (filtersRef.current) ro.observe(filtersRef.current);
    
    return () => {
      clearTimeout(timer);
      if (el) {
        el.removeEventListener("scroll", updateArrows);
      }
      window.removeEventListener("resize", updateArrows);
      ro.disconnect();
    };
  }, [categoryList]);

  const scrollFiltersBy = (distance) => {
    const el = filtersRef.current;
    if (!el) return;
    el.scrollBy({ left: distance, behavior: "smooth" });
  };

  const renderFilterBar = () => (
    <div ref={filtersWrapRef} className="filters-wrap">
      {showLeftArrow && (
        <button
          className="filter-arrow filter-arrow-left"
          aria-label="Scroll left"
          onClick={() => scrollFiltersBy(-200)}
        >
          ◄
        </button>
      )}

      <div
        ref={filtersRef}
        className="filters-row"
        aria-label="Categories"
      >
        {categoryList.map((ch) => (
          <button
            key={ch}
            onClick={() => setCategory(ch)}
            className={`chip ${category === ch ? "chip-active" : ""}`}
            aria-pressed={category === ch}
          >
            {ch}
          </button>
        ))}
      </div>

      {showRightArrow && (
        <button
          className="filter-arrow filter-arrow-right"
          aria-label="Scroll right"
          onClick={() => scrollFiltersBy(200)}
        >
          ►
        </button>
      )}
    </div>
  );

  if (!auth || !auth.user) {
    return (
      <div ref={containerRef} className="p-6 main-content">
        {renderFilterBar()}

        <div className="flex justify-center mt-12">
          <div className="w-full max-w-3xl p-8 text-center bg-white rounded-lg shadow-xl">
            <h2 className="mb-3 text-2xl font-bold">Try searching to get started</h2>
            <p className="text-gray-600">
              Start watching videos to help us build a feed of videos that you'll love.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 p-6 main-content">
      {renderFilterBar()}

      {error && (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="p-3 text-red-700 border border-red-100 rounded bg-red-50">
            {`Unable to load videos from backend: ${error}. Please check the backend server.`}
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center">Loading videos...</div>
      ) : !videos || videos.length === 0 ? (
        <div className="flex justify-center">
          <div className="w-full max-w-3xl p-8 text-center bg-white rounded-lg shadow-xl">
            <h2 className="mb-3 text-2xl font-bold">Try searching to get started</h2>
            <p className="text-gray-600">
              Start watching videos to help us build a feed of videos that you'll love.
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={feedRef}
          className="overflow-auto feed-scroll"
          style={{ paddingRight: 8 }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((v, idx) => (
              <VideoCard key={v._id} video={v} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}