
# YouClone – Full Stack YouTube Clone

YouClone is a **full-stack YouTube-like video streaming platform** built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
It implements real-world features such as authentication, channels, videos, comments, likes, search, filters, and a fully responsive UI.

This project was developed as a **capstone-level real-world application**, closely mimicking **YouTube’s core functionality and UI behavior**.

---

## Live Features Overview

###  Authentication

- User signup & login
- JWT-based authentication
- Protected routes (comments, likes, channel creation)
- Logout clears user session and Redux state

---

###  Home Page

- Videos displayed only when user is signed in
- Logged-out users see:

  > *“Try searching to get started.  
  > Start watching videos to help us build a feed you’ll love.”*

- Category filter bar (horizontal scroll)
- Search results based on video title
- Responsive grid layout (YouTube-like feed)

---

###  Search & Filter

- Search bar in header
- Live dropdown suggestions while typing
- Clicking suggestion opens video page
- Category filters (Web, JavaScript, Music, Gaming, etc.)
- Sorting options:
  - Latest
  - Popular
  - Oldest

---

###  Video Player Page

- Video player
- Title, views, upload date
- Channel information (avatar, name)
- Like & Dislike buttons
- Share button (UI)
- Expandable description
- **Comment system**
  - Add comment
  - Edit comment
  - Delete comment
  - Owner-only 3-dot menu
- Comments stored and fetched per video

---

###  Comments System

- Fully backend-connected
- Each comment linked to:
  - Video
  - User
- Permissions enforced:
  - Only comment owner can edit or delete
- Redux-synced real-time updates

---

### Channel System

- Create channel (login required)
- Each user can have **only one channel**
- Channel page includes:
  - Banner
  - Avatar
  - Channel name
  - Subscriber count
  - Description
  - Tabs (UI): Home, Videos, Shorts, Live, Playlists, Community
- **Videos tab fully implemented**
- Channel videos displayed in YouTube-style grid

---

###  Profile / Channel Access

- Header shows profile avatar only
- Avatar menu options:
  - Your Channel
  - Create Channel
  - Settings (UI)
  - Sign Out
- Routes supported:
  - `/channel` → logged-in user’s channel
  - `/channel/:id` → any public channel

---

###  Channel Videos

- Channel page lists only that channel’s videos
- Sorting inside channel:
  - Latest
  - Popular
  - Oldest
- Channel owner actions:
  - Edit video
  - Delete video

---

###  Seed Data (Development)

- Multiple users
- Multiple channels
- **20 videos across categories**
- Pre-linked relationships:
  - Videos → Channels
  - Videos → Uploaders
  - Comments → Videos
- Realistic views, likes, and timestamps

---

###  Responsive Design

- Desktop
- Tablet (iPad, iPad Pro)
- Mobile
- Fixed header
- Fixed sidebar (desktop)
- Scrollable video feed
- Mobile sidebar toggle

---

## Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

##  Project Structure

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
│   │   │   └── CreateChannelModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── ChannelPage.jsx
│   │   │   └── CreateVideo.jsx
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── VideoSlice.js
│   │   │   ├── commentsSlice.js
│   │   │   └── channelsSlice.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html

````

---

##  Environment Variables

Create a `.env` file inside `backend/`:

```env
Note: Create a .env file in the backend directory using the provided .env.example file.
MONGO_URI=mongodb://localhost:27017/youclone
JWT_SECRET=your_jwt_secret
PORT=5000
````

---

##  Running the Project

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Seed Database

```bash
node seed.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

---

##  API Endpoints (Summary)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`

### Videos

* `GET /api/videos`
* `GET /api/videos/:id`
* `POST /api/videos`
* `PUT /api/videos/:id`
* `DELETE /api/videos/:id`
* `POST /api/videos/:id/like`
* `POST /api/videos/:id/dislike`

### Comments

* `GET /api/comments/:videoId`
* `POST /api/comments/:videoId`
* `PUT /api/comments/:id`
* `DELETE /api/comments/:id`

### Channels

* `POST /api/channels`
* `GET /api/channels`
* `GET /api/channels/:id`

---

##  Capstone Requirements Covered

✔ Authentication
✔ CRUD operations
✔ Redux state management
✔ Real database integration
✔ Owner-based permissions
✔ Responsive UI
✔ Search & filters
✔ Seed data
✔ Production-style architecture

---

##  Future Enhancements

* Subscriptions system
* Watch history
* Playlists
* Notifications
* Real video uploads (Cloudinary / AWS S3)
* Live streaming
* Admin dashboard

---

##  Author

**Mandala Bhavani Shankar**
Full-Stack Developer (React | Node | MongoDB)

 GitHub:
[https://github.com/bhavanishankar7075/CAPSTONE-PROJECT](https://github.com/bhavanishankar7075/CAPSTONE-PROJECT)


