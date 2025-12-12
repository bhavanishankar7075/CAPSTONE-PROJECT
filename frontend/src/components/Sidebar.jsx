// frontend/src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/layout.css";
import { useSelector } from "react-redux";

/* data arrays */
const topItems = [
  { key: "shorts", label: "Shorts", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3v18l15-9L5 3z"/></svg>), to: "/shorts" },
  { key: "subscriptions", label: "Subscriptions", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M10 8v5l6 3v-8"/></svg>), to: "/subscriptions" },
  { key: "library", label: "Library", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v2H6zM6 10h12v2H6zM6 14h8v2H6z"/></svg>), to: "/library" },
  { key: "history", label: "History", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3a9 9 0 100 18 9 9 0 000-18zm1 10H8V7h2v4h4v2z"/></svg>), to: "/history" },
];

const moreUser = [
  { key: "your-videos", label: "Your videos", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M10 8v7l6-3.5L10 8z"/></svg>), to: "/your-videos" },
  { key: "playlists", label: "Playlists", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h14v2H3zM3 10h14v2H3zM3 14h10v2H3z"/></svg>), to: "/playlists" },
  { key: "watch-later", label: "Watch later", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7v6l5 3 1-1.73-4-2.27V7zM12 3a9 9 0 100 18 9 9 0 000-18z"/></svg>), to: "/watch-later" },
  { key: "liked", label: "Liked videos", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-9-7.1C1.4 11 3 6 7 4c2-1 4 0 5 1 1-1 3-2 5-1 4 2 5.6 7 4 9.9C19 16.65 12 21 12 21z"/></svg>), to: "/liked" },
];

const explore = [
  { key: "trending", label: "Trending", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17h4v4H3zM10 10h4v11h-4zM17 3h4v18h-4z"/></svg>) },
  { key: "shopping", label: "Shopping", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h10l1.4 6H5.6L7 4zM6 20a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"/></svg>) },
  { key: "music", label: "Music", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1114 21V11h-4V3z"/></svg>) },
  { key: "films", label: "Films", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6H3v12h18V6zM7 8h2v2H7V8zm0 4h2v2H7v-2z"/></svg>) },
  { key: "live", label: "Live", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v8l6-4z"/></svg>) },
  { key: "gaming", label: "Gaming", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v2H6v2h2v2h2V9h2V7H10V5H8z"/></svg>) },
  { key: "news", label: "News", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v4H3zM3 11h14v8H3z"/></svg>) },
  { key: "sports", label: "Sports", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>) },
  { key: "learning", label: "Learning", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 11l-10-5v6l10 5 10-5v-6l-10 5z"/></svg>) },
  { key: "fashion", label: "Fashion & beauty", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s3 4 3 6-3 6-3 6-3-4-3-6 3-6 3-6z"/></svg>) }
];

const moreFromYT = [
  { label: "YouTube Premium", iconColor: "#FF0000" },
  { label: "YouTube Music", iconColor: "#FF3B30" },
  { label: "YouTube Kids", iconColor: "#FF3B30" }
];

const settingsLinks = [
  { key: "settings", label: "Settings", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8 4a6.97 6.97 0 01-.13 1.2l2 1.5-1.5 2-1.5-2a6.97 6.97 0 01-1.2.13 6.97 6.97 0 01-1.2-.13l-1.5 2-2-1.5 1.5-2c-.08-.4-.13-.8-.13-1.2s.05-.8.13-1.2L7 8.4 5 6.9l1.5-2 1.5 2c.4-.08.8-.13 1.2-.13s.8.05 1.2.13l1.5-2 2 1.5-1.5 2c.08.4.13.8.13 1.2z"/></svg>) },
  { key: "report", label: "Report history", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v6c0 5 3 9 9 9s9-4 9-9V7l-9-5z"/></svg>) },
  { key: "help", label: "Help", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-.8.45-1.5 1.17-2.17l1.24-1.26A1.99 1.99 0 0012 7c-1.11 0-2 .89-2 2H8c0-2.21 1.79-4 4-4 1.1 0 2 .9 2 2 0 .7-.35 1.25-.93 1.75z"/></svg>) },
  { key: "feedback", label: "Send feedback", icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6h-18v12h4v4l4-4h10z"/></svg>) }
];

export default function Sidebar({ sidebarOpen = true }) {
  const expanded = sidebarOpen;
  const auth = useSelector((s) => s.auth);
  const effectiveUser = auth?.user || (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  })();

  const signedIn = !!effectiveUser;

  return (
    <aside
      className={`app-sidebar bg-white border-r p-4 ${expanded ? "w-72" : "w-20"} transition-all duration-150 hidden lg:block`}
      aria-label="Main sidebar"
    >
      <div className="space-y-3">
        <Link to="/" className="flex items-center gap-4 px-2 py-3 bg-gray-100 rounded-lg hover:bg-gray-100">
          <div className="p-2 bg-gray-200 rounded-md">
            <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          {expanded && <div className="text-sm font-medium">Home</div>}
        </Link>

        {topItems.map((it) => (
          <Link key={it.key} to={it.to} className="flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-gray-50">
            <div className="p-2 bg-white border border-transparent rounded-md hover:border-gray-200">{it.icon}</div>
            {expanded && <div className="text-sm text-gray-700">{it.label}</div>}
          </Link>
        ))}
      </div>

      <div className="my-4 border-t" />

      <div className="space-y-4">
        {!signedIn && expanded && (
          <div className="p-3 border rounded-lg">
            <div className="mb-2 text-sm text-gray-700">Sign in to like videos, comment and subscribe.</div>
            <Link to="/auth" className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
              Sign in
            </Link>
          </div>
        )}

        <div className="space-y-2">
          {moreUser.map((m) => (
            <Link key={m.key} to={m.to} className="flex items-center gap-4 px-2 py-2 rounded-lg hover:bg-gray-50">
              <div className="p-2 bg-white border border-transparent rounded-md hover:border-gray-200">{m.icon}</div>
              {expanded && <div className="text-sm text-gray-700">{m.label}</div>}
            </Link>
          ))}
        </div>
      </div>

      <div className="my-4 border-t" />

      <div className="space-y-3">
        {expanded && <div className="text-sm font-semibold">Explore</div>}
        <div className="flex flex-col gap-2">
          {explore.map((it) => (
            <button key={it.key} title={it.label} className="flex items-center gap-4 px-2 py-3 text-sm rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-center w-10 h-10 bg-white border border-transparent rounded-md hover:border-gray-200">
                {it.icon}
              </div>
              {expanded && <span className="text-gray-700">{it.label}</span>}
            </button>
          ))}
          {expanded && <button className="flex items-center gap-4 px-2 py-3 text-sm rounded-lg hover:bg-gray-50"><div className="w-10 h-10"></div><span>Show more</span></button>}
        </div>
      </div>

      <div className="my-4 border-t" />

      <div className="space-y-3">
        {expanded && <div className="text-sm font-semibold">More from YouTube</div>}
        {moreFromYT.map((m) => (
          <div key={m.label} className="flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-center w-10 h-10 bg-white border border-transparent rounded-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill={m.iconColor}><path d="M10 8v7l6-3.5L10 8z"/></svg>
            </div>
            {expanded && <div className="text-sm">{m.label}</div>}
          </div>
        ))}
      </div>

      <div className="my-4 border-t" />

      <div className="space-y-2">
        {settingsLinks.map((s) => (
          <button key={s.key} title={s.label} className="flex items-center gap-4 px-2 py-3 text-sm rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-center w-10 h-10 bg-white border border-transparent rounded-md">
              {s.icon}
            </div>
            {expanded && <div className="text-sm text-gray-700">{s.label}</div>}
          </button>
        ))}
      </div>

      <div className="pt-4 mt-6 text-xs text-gray-500 border-t">
        {expanded && (
          <>
            <div className="flex flex-wrap gap-2">
              <span>About</span>
              <span>Press</span>
              <span>Copyright</span>
              <span>Contact us</span>
            </div>
            <div className="mt-3">© 2025 YouClone</div>
          </>
        )}
      </div>
    </aside>
  );
}
