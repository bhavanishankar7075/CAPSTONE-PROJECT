
# 🎬 YouClone – Full Stack YouTube Clone

A **full-stack YouTube-like video streaming platform** built using **MERN stack** (MongoDB, Express, React, Node.js) with modern UI and real-world features such as authentication, channels, videos, comments, likes, search, filters, and responsive design.

This project is built as a **capstone-level real-world application**, closely mimicking **YouTube’s core functionality and UI behavior**.

---

## 🚀 Live Features Overview

### 🔐 Authentication

* User signup & login
* JWT-based authentication
* Protected routes (comments, likes, channel creation)
* Logout clears user session and video feed

---

### 🏠 Home Page

* Displays videos only when user is signed in
* Logged-out users see:

  > *“Try searching to get started.
  > Start watching videos to help us build a feed you’ll love.”*
* Category filter bar (mini navbar)
* Search results based on video title
* Infinite-like grid layout (responsive)

---

### 🔍 Search & Filter

* Search bar in header
* Live dropdown suggestions while typing
* Click suggestion → opens video page
* Category filter buttons (Web, JS, Music, Gaming, etc.)
* Sorting:

  * Latest
  * Popular
  * Oldest

---

### 🎥 Video Player Page

* Video player
* Title, views, upload date
* Channel info (avatar, name)
* Like & Dislike buttons
* Share button (UI)
* Expandable description
* **Comment system**

  * Add comment
  * Edit comment
  * Delete comment
  * 3-dot menu for comment owner
* Comments saved to database per video

---

### 💬 Comments System

* Backend-connected comments
* Each comment linked to:

  * Video
  * User
* Permissions:

  * Only comment owner can edit/delete
* Fully synced Redux state

---

### 📺 Channel System

* Create channel (only after login)
* Each user can have **one channel**
* Channel page shows:

  * Banner
  * Avatar
  * Channel name
  * Subscriber count
  * Description
  * Tabs (UI): Home, Videos, Shorts, Live, Playlists, Community
* **Videos tab implemented**
* Channel videos grid exactly like YouTube UI

---

### 👤 Profile / Channel Access

* Header profile avatar only (no username text)
* Clicking avatar opens menu:

  * Your Channel
  * Create Channel
  * Settings (UI)
  * Sign Out
* Clicking **Your Channel** opens `/channel`
* Supports:

  * `/channel` → logged-in user’s channel
  * `/channel/:id` → any public channel

---

### 🎞️ Channel Videos

* Channel page lists only that channel’s videos
* Sorting inside channel:

  * Latest
  * Popular
  * Oldest
* Channel owner actions:

  * Edit video
  * Delete video

---

### 🧠 Seed Data (Development)

* Multiple users
* Multiple channels
* **20 videos across categories**
* Pre-linked:

  * Videos → Channels
  * Videos → Uploaders
  * Comments → Videos
* Realistic views, likes, dates

---

### 📱 Responsive Design

* Desktop
* Tablet (iPad, iPad Pro)
* Mobile
* Fixed header
* Fixed sidebar (desktop)
* Scrollable video feed only
* Mobile sidebar toggle

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

## 📁 Project Structure

```
youclone/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── videoController.js
│   │   ├── commentController.js
│   │   └── channelController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Video.js
│   │   ├── Comment.js
│   │   └── Channel.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── videos.js
│   │   ├── comments.js
│   │   └── channels.js
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Comments.jsx
│   │   │   └── CreateChannelModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── ChannelPage.jsx
│   │   │   └── CreateVideo.jsx
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── videoSlice.js
│   │   │   ├── commentsSlice.js
│   │   │   └── channelsSlice.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
```

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/youclone
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## ▶️ Running the Project

### 1️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 2️⃣ Seed Database

```bash
node seed.js
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

---

## 📡 API Endpoints (Summary)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Videos

* `GET /api/videos`
* `GET /api/videos/:id`
* `POST /api/videos/:id/like`
* `POST /api/videos/:id/dislike`

### Comments

* `GET /api/comments/:videoId`
* `POST /api/comments/:videoId`
* `PUT /api/comments/:id`
* `DELETE /api/comments/:id`

### Channels

* `POST /api/channels`
* `GET /api/channels/me`
* `GET /api/channels/:id`
* `GET /api/channels`

---

## ✅ Capstone Requirements Covered

✔ Authentication
✔ CRUD operations
✔ Redux state management
✔ Real database integration
✔ Role-based access (owner permissions)
✔ Responsive UI
✔ Search & filter
✔ Seed data
✔ Production-style architecture

---

## 📌 Future Enhancements

* Subscriptions system
* Watch history
* Playlists
* Notifications
* Real video upload (Cloudinary / S3)
* Live streaming
* Admin dashboard

---

## 👨‍💻 Author

**Mandala Bhavani Shankar**
Full-Stack Developer (React | Node | MongoDB)
GITHUB-LINK:https://github.com/bhavanishankar7075/CAPSTONE-PROJECT

---


