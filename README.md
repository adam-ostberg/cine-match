# CineMatch

A collaborative movie discovery app designed to solve the problem of "what should we watch tonight?" Inspired by Tinder, users can create a session, invite friends, and swipe right or left on movies. When everyone in the group likes the same movie, it's a match!

## Project Setup

### Prerequisites

- Node.js
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://gits-15.sys.kth.se/iprog-students/adamostb-glundbo-rnordahl-HT25-Project/blob/main/README.md 
   cd adamostb-glundbo-rnordahl-HT25-Project
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Build for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

### Deployment

The project is configured for Firebase Hosting. The built files are output to the `dist` folder.

---

## 3rd Party Components

### UI Components & Libraries

| Component | Library | Usage Location |
|-----------|---------|----------------|
| Material UI Icons & Buttons | `@mui/material`, `@mui/icons-material` | Used throughout for icons (`IconButton`, `FavoriteIcon`, `CloseRoundedIcon`, etc.) in `src/views/NavbarView.tsx`, `src/views/SwipeView.tsx`, `src/views/DetailsView.tsx` |
| React Icons | `react-icons` | Icons like `FaUserCircle`, `FaPlay`, `FaPause`, `FaArrowLeft` in `src/views/DetailsView.tsx`, `src/views/profileView.tsx` |
| Boring Avatars | `boring-avatars` | User avatar generation in `src/components/UserAvatar.tsx` |
| Lottie Animations | `@lottiefiles/dotlottie-react` | Swipe animation in `src/views/SwipeView.tsx` |
| Framer Motion | `motion` (framer-motion) | Card swiping animations and transitions in `src/views/SwipeView.tsx`, `src/views/matchAnimationView.tsx` |
---

## Project Structure

```
src/
├── apiConfig.ts          # TMDB API configuration and fetch functions
├── authService.ts        # Firebase Authentication abstraction
├── App.tsx               # Main app with routing
├── main.tsx              # Entry point
├── MovieModel.ts         # Core business logic model
├── SessionModel.ts       # Session state management
├── UserModel.ts          # User state management
├── mobxReactiveModel.ts  # MobX reactive wrapper
├── firebaseModel.ts      # Firebase persistence layer
├── firestoreModel.ts     # Firestore database operations
├── components/           # Reusable UI components
├── views/                # View components (UI)
└── reactts/              # Presenter components (logic)
```

---

## Features

- **User Authentication:** Sign up and log in with email/password
- **Session System:** Create lobbies and invite friends via lobby codes
- **Movie Swiping:** Tinder-style swiping interface for movies
- **Real-time Matching:** Instant notification when all users like the same movie
- **Movie Details:** View trailers, cast, ratings, and streaming availability
- **Friend System:** Add friends and send session invites
- **Filter Options:** Customize movie recommendations by genre, rating, and runtime

---

## Team Members

- adamostb
- glundbo
- rnordahl
