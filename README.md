# 📺 YouTube Clone

A full-stack YouTube-inspired video platform built with the MERN stack. Users can register, create channels, upload videos, search and filter by category, like/dislike, and comment — all managed through a Redux-powered frontend and a JWT-secured REST API backend.

[![GitHub](https://img.shields.io/badge/GitHub-Youtube--Clone-black?style=for-the-badge&logo=github)](https://github.com/bhavanishankar7075/Youtube-Clone)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)

---

## 📌 Project Overview

A feature-complete YouTube clone that replicates core platform functionality — user auth, channel management, video CRUD, search, category filtering, views tracking, likes/dislikes, and a full comment system with edit and delete support.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **State Management:** Redux Toolkit (`authSlice`, `VideoSlice`, `channelsSlice`, `commentsSlice`)
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS
- **HTTP:** Axios
- **Utilities:** date-fns (timestamps), react-hot-toast (notifications)

### Backend
- **Runtime:** Node.js + Express.js v5
- **Database:** MongoDB + Mongoose ODM
- **Auth:** JWT + bcryptjs (password hashing)
- **Validation:** express-validator
- **File Handling:** Multer
- **ID Generation:** nanoid (unique video IDs)
- **Dev:** Nodemon

---

## ✨ Features

### 👤 Authentication
- Register and login with email + password
- Passwords hashed with **bcryptjs**
- **JWT-protected** routes for all write operations
- Auth state persisted via Redux (`authSlice`)

### 📺 Channel Management
- Create a personal channel (one per user)
- Channel banner, description, subscriber count
- View all videos uploaded to a channel on the Channel page
- `CreateChannelModal` component for smooth in-app channel creation

### 🎬 Video Management
- Upload videos with title, thumbnail URL, video URL, description, and category
- Unique video IDs generated with **nanoid**
- Edit and delete your own videos (owner-only, enforced server-side)
- View count automatically incremented on each video open

### 🔍 Search & Filter
- Search videos by title (regex-powered, case-insensitive)
- Filter by category: All, Web Development, JavaScript, React, Node.js, Full Stack, Music, Gaming, Live, and more
- Scrollable category filter bar with left/right navigation arrows

### 👍 Likes & Dislikes
- Like or dislike any video
- Counts stored per video in MongoDB
- Updates reflected instantly via Redux state

### 💬 Comment System
- Add comments on any video
- **Edit** your own comments inline
- **Delete** your own comments
- Comment timestamps with date-fns formatting
- Comments fetched and managed via `commentsSlice`

---

## 📁 Project Structure

```
Youtube-Clone/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login
│   │   ├── videoController.js  # CRUD, like, dislike, view
│   │   ├── channelController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   ├── Video.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── videos.js
│   │   ├── channels.js
│   │   ├── comments.js
│   │   └── users.js
│   ├── seed.js                 # Database seeder
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js        # Axios instance with base URL
        ├── components/
        │   ├── Header.jsx      # Navbar + search bar
        │   ├── Sidebar.jsx
        │   ├── VideoCard.jsx
        │   ├── VideoGrid.jsx
        │   └── CreateChannelModal.jsx
        ├── pages/
        │   ├── Home.jsx        # Video grid + category filter
        │   ├── VideoPlayer.jsx # Player + likes + comments
        │   ├── ChannelPage.jsx
        │   ├── CreateVideo.jsx
        │   └── Auth.jsx        # Login / Register
        └── store/
            ├── store.js
            ├── authSlice.js
            ├── VideoSlice.js
            ├── channelsSlice.js
            └── commentsSlice.js
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |

### Videos
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/videos` | List all videos (supports `?q=` and `?category=`) |
| POST | `/api/videos` | Upload video *(protected)* |
| GET | `/api/videos/:id` | Get single video |
| PUT | `/api/videos/:id` | Update video *(owner only)* |
| DELETE | `/api/videos/:id` | Delete video *(owner only)* |
| POST | `/api/videos/:id/view` | Increment view count |
| POST | `/api/videos/:id/like` | Like video *(protected)* |
| POST | `/api/videos/:id/dislike` | Dislike video *(protected)* |

### Channels
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/channels` | Create channel *(protected)* |
| GET | `/api/channels/:id` | Get channel details + videos |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/comments/:videoId` | Get all comments for a video |
| POST | `/api/comments` | Add comment *(protected)* |
| PUT | `/api/comments/:id` | Edit comment *(owner only)* |
| DELETE | `/api/comments/:id` | Delete comment *(owner only)* |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (LTS)
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/bhavanishankar7075/Youtube-Clone.git
cd Youtube-Clone
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `.env` from the example:
```env
MONGO_URI=mongodb://localhost:27017/youclone
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev       # Starts on http://localhost:5000

# Optional: seed sample data
npm run seed
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev       # Starts on http://localhost:5173
```

---

## 🗄️ Database Schema

| Collection | Key Fields |
|---|---|
| **users** | username, email, password (bcrypt), avatar, channels[] |
| **channels** | channelName, owner (ref: User), description, channelBanner, subscribers, videos[] |
| **videos** | videoId (nanoid), title, thumbnailUrl, videoUrl, description, category, channel, uploader, views, likes, dislikes, comments[] |
| **comments** | text, userId (ref: User), videoId (ref: Video), timestamp |

---

## 🔐 Auth Flow

```
User registers → password hashed with bcryptjs → stored in MongoDB
User logs in   → credentials verified → JWT issued → stored in Redux authSlice
Protected API  → JWT sent in Authorization header → authMiddleware verifies → access granted
Owner checks   → server compares video.uploader / comment.userId to req.user.id
```

---

## 🔮 Future Improvements

- Video file upload directly (currently URL-based) using Cloudinary or AWS S3
- Subscription system (subscribe/unsubscribe channels)
- Notification system for new uploads
- Video recommendations based on category
- Nested replies on comments
- Playlist creation and management
- Watch history per user

---

## 👨‍💻 Author

**Bhavani Shankar Mandala**
[LinkedIn](https://www.linkedin.com/in/bhavani-shankar-mandala-b728782ba/) • [GitHub](https://github.com/bhavanishankar7075)
