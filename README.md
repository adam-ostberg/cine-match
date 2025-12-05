# CineMatch

### Short Description
CineMatch is a collaborative movie discovery app designed to solve the problem of "what should we watch tonight?" Inspired by Tinder, users can create a session, invite friends, and swipe right or left on movies. When everyone in the group likes the same movie, it's a match!

### What We Have Done
* **Framework Setup:** Initialized the project using React, TypeScript, and Vite.
* **Architecture:** Implemented the MVP pattern to separate business logic from UI, same as Dinnermodel.
* **State Management:** Integrated MobX for reactive state management, allowing the UI to update automatically when data changes.
* **API Integration:** Connected The Movie Database (TMDB) API and imdbdev API. We can currently fetch lists of popular movies and specific movie details, and get their imdb rating.
* **Home Screen:** Created a functioning Home View featuring an infinite scrolling carousel of popular movie posters fetched from the API.
* **Routing:** Set up `react-router-dom` to navigate between the Home, Swipe, and Details views.
<!-- * **Firebase Setup:** Configured Firebase for the backend. Implemented Anonymous Authentication and set up the basic database rules for handling sessions -->.

### What we plan to do
*   **Lobby System:** Finalize the logic for creating unique session IDs and allowing other users to join a specific lobby via a code/link.
*   **Swiping Interface:** Implement the actual card-swiping UI (Tinder-style) for the Swipe View.
*   **Voting Logic:** Connect the swipes to the Firebase Realtime Database to store user preferences (likes/dislikes) per session.
*   **Matching Algorithm:** Implement the logic to detect when a movie has been liked by all users in a session and display the result.
*   **Views:** Finalize the UX for all views to become consistent and look good. Improve the overall CSS and responsiveness (hover, active usage) of the application.

### Project File Structure

**Root / Configuration**
*   `src/main.tsx`: The entry point of the application. Mounts the React app and initializes the reactive model.
*   `src/App.tsx`: Handles the client-side routing (React Router) and mapping paths to Presenters.
*   `src/apiConfig.ts`: Contains the API keys and fetch functions for retrieving data from TMDB (The Movie Database).
*   `src/imdbApiConfig.ts`: Contains the API keys and fetch functions for retrieving data from the imdb API.
*   `src/firebaseConfig.ts`: Initializes the Firebase app<!--  and exports references to Auth and the Database -->.
*   `src/resolvePromise.ts`: Utility function used to track the state (loading, data, error) of asynchronous API calls.

**Model (Data & Logic)**
*   `src/MovieModel.ts`: The core "brain" of the application, holds all business logic. It, e.g., holds the state (current movie, movie lists) and handles API calls.
*   `src/mobxReactiveModel.ts`: Wraps the plain TypeScript model in a MobX observable to make the UI reactive to state changes.

**Presenters (Logic/View Connection)**
*   `src/presenters/homePresenter.tsx`: Connects the HomeView to the Model. It triggers data fetching for popular movies and handles navigation logic.
*   `src/presenters/detailsPresenter.tsx`: Manages the logic for displaying specific movie details.
*   `src/presenters/swipePresenter.tsx`: Handle the logic for the swiping interface and user voting.

**Views (UI Components)**
*   `src/views/HomeView.tsx`: The visual component for the landing page, displaying the "Start Session" button and the movie carousel.
*   `src/views/DetailsView.tsx`: Displays detailed information about a selected movie.
*   `src/views/SwipeView.tsx`: The main game interface for swiping on movies.

**Styling**
*   `src/style.css`: Global CSS styles for the application, including the carousel animations and layout.