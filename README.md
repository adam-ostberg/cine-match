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
* **Firebase Setup:** Configured Firebase for the backend. Implemented Authentication and set up the basic database rules for handling sessions.

### What we plan to do
*   **Lobby System:** Finalize the logic for creating unique session IDs and allowing other users to join a specific lobby via a code/link. The base logic is there but needs a bit of improvement.
*   **Swiping Interface:** Implement the actual card-swiping UI (Tinder-style) for the Swipe View.
*   **Matching Algorithm:** Implement the logic to detect when a movie has been liked, and the Swipe View showing recommendations based off that resulting swipe.
*   **UI/UX Polish:** Improve the overall CSS, responsiveness, and transitions between views to make the application feel more cohesive.

### Project File Structure – MVP

**Root / Configuration**
*   `src/main.tsx`: The entry point of the application. Mounts the React app and initializes the reactive model.
*   `src/App.tsx`: Handles the client-side routing (React Router) and mapping paths to Presenters.
*   `src/apiConfig.ts`: Contains the API keys and fetch functions for retrieving data from TMDB (The Movie Database).
*   `src/imdbApiConfig.ts`: Contains the API keys and fetch functions for retrieving data from the imdb API.
*   `src/firebaseConfig.ts`: Initializes the Firebase app<!--  and exports references to Auth and the Database -->.
*   `src/authService.ts`: Abstraction layer for Firebase Authentication. Handles user sign-up, sign-in, and observing auth state changes.
*   `src/helperFunctions.ts`: Utility functions for formatting time, getting video URLs, and determining country codes.
*   `src/resolvePromise.ts`: Utility function used to track the state (loading, data, error) of asynchronous API calls.

**Model (Data & Logic)**
*   `src/MovieModel.ts`: The core "brain" of the application, holds all business logic. It, e.g., holds the state (current movie, movie lists) and handles API calls.
*   `src/mobxReactiveModel.ts`: Wraps the plain TypeScript model in a MobX observable to make the UI reactive to state changes.
*   `src/firestoreModel.ts`: Manages all interactions with the Firestore database, including creating/joining sessions, recording swipes, and listening for real-time match updates.

**Presenters (Logic/View Connection)**
*   `src/presenters/homePresenter.tsx`: Connects the HomeView to the Model. It triggers data fetching for popular movies and handles navigation logic.
*   `src/presenters/detailsPresenter.tsx`: Manages the logic for displaying specific movie details.
*   `src/presenters/swipePresenter.tsx`: Handle the logic for the swiping interface and user voting.
*   `src/presenters/accountPresenter.tsx`: Handles user login and signup logic by communicating with the authService.
*   `src/presenters/optionsPresenter.tsx`: Manages the movie filter settings (genres, runtime, rating) and updates the model accordingly.

**Views (UI Components)**
*   `src/views/HomeView.tsx`: The visual component for the landing page, displaying the "Start Session" button and the movie carousel.
*   `src/views/DetailsView.tsx`: Displays detailed information about a selected movie.
*   `src/views/SwipeView.tsx`: The main game interface for swiping on movies.
*   `src/views/SuspenseSwipeView.tsx`: A skeleton loading view displayed while the movie queue is being fetched.
*   `src/views/accountView.tsx`: Provides the form interface for users to log in or sign up.
*   `src/views/OptionsView.tsx`: The UI for adjusting search filters, including sliders for runtime/rating and buttons for genres.

**Styling**
*   `src/style.css`: Global CSS styles for the application.