import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './login'; // Import Login component directly
import SignUp from "./signup";
import { Dashboard } from "@mui/icons-material";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />, // Login as the default route
  },
  {
    path: 'SignUp',
    element: <SignUp />
  },
  {
    path: 'dashboard',
    element: <Dashboard />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
