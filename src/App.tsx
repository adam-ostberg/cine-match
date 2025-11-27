import { HomeView } from "./views/HomeView";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { OptionsView } from "./views/OptionsView";
import { SwipeView } from "./views/SwipeView";

function App() {

  function makeRouter(){
      return createHashRouter([
          {
              path: "/",
              element: <HomeView/>,
          },
          {
              path: "/options",
              element: <OptionsView/>,
          },
          {
              path: "/swipe",
              element: <SwipeView/>,
          },
      ]);
  }
  const router = makeRouter();

  return (
  <div className="mainContent">
      <RouterProvider router={router}/>
  </div>      
  );
}

export default App
