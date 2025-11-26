import { HomeView } from "./HomeView";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { OptionsView } from "./OptionsView";
import { SwipeView } from "./SwipeView";

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
