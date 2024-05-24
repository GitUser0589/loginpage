import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './login'; // Import Login component directly
import SignUp from "./signup";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />, // Login as the default route
  },
  {
    path: 'SignUp',
    element: <SignUp />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
